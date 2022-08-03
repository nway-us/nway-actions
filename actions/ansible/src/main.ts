import * as fs from 'fs';
import * as core from '@actions/core';

import ConsulHelper from './utils/consul';
import { Ansible } from './utils/ansible';
import { Input } from './interfaces/input.interface';


function getConfig(): Input {
    const config: Input = {
        hostList: core.getInput('host_list', {required: true}),
        consul: {
            host: core.getInput('consul_host', {required: true}),
            token: core.getInput('consul_token', {required: true}),
        },
        configPath: core.getInput('config_path', {required: true}),
        sshKey: core.getInput('ssh_key', {required: true}),
        user: core.getInput('vm_user', {required: true})
    }

    config.sshKey = config.sshKey.split(',').map(item => item.trim()).join(',');

    return config;
}

async function run(): Promise<void> {
    const config = getConfig();

    const consul = new ConsulHelper(config.consul);
    const ansible = new Ansible();

    const configStr = await consul.DownloadFromConsul(config.configPath);

    fs.writeFileSync('playbook.yml', configStr);

    ansible.configSshKey(config);

    ansible.configAnsibleHosts(config);

    await ansible.applyPlaybook(config);
}

run().catch(e => core.setFailed(e.message));
