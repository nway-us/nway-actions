
import { info } from '@actions/core';
import { execSync } from 'child_process';

import { Input } from "../interfaces/input.interface";

export class Ansible {

    configSshKey(config: Input) {
        execSync('mkdir -p ~/.ssh')

        const hosts = config.hostList.split(',').join('\n');

        execSync(`echo "${hosts}" >> ~/.ssh/known_hosts`)

        execSync(`(umask  077 ; echo "${config.sshKey}" | base64 --decode > ~/.ssh/ansible_rsa)`)
    }

    configAnsibleHosts(config: Input) {
        execSync(`sudo mkdir /etc/ansible || true`)

        const hosts = config.hostList
        .split(',')
        .map(item => `${item} ansible_ssh_private_key_file=~/.ssh/ansible_rsa`)
        .join('\n');

        execSync(`sudo cat << EOF > /etc/ansible/hosts
[deploy]
${hosts}
EOF`)
    }

    async applyPlaybook(config: Input) {
        const response = await execSync(`/root/.local/bin/ansible-playbook ./playbook.yml -u ${config.user} --extra-vars "${config.extraVars}"`)

        info(response.toString())
    }
}
