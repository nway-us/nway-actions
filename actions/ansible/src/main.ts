import YAML from 'yaml';
import * as fs from 'fs';
import * as core from '@actions/core';

import ConsulHelper from './utils/consul';
import { Ansible } from './utils/ansible';
import { Input } from './interfaces/input.interface';


function getConfig(): Input {
    const config: Input = {
        hostList: core.getInput('host_list', {required: false}),
        consul: {
            host: core.getInput('consul_host', {required: false}),
            token: core.getInput('consul_token', {required: false}),
        },
        configPath: core.getInput('config_path', {required: false}),
        sshKey: core.getInput('ssh_key', {required: false}),
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

    const values = new YAML.Document();

    // @ts-ignore
    values.contents = JSON.parse(configStr);

    fs.writeFileSync('playbook.yml', values.toString());

    ansible.configSshKey(config);

    ansible.configAnsibleHosts(config);

    ansible.applyPlaybook(config);
}

run().catch(e => core.setFailed(e.message));
