
import { info } from '@actions/core';
import { execSync } from 'child_process';

import { Input } from "../interfaces/input.interface";

export class Ansible {

    configSshKey(config: Input) {
        execSync('mkdir -p ~/.ssh')

        execSync(`(umask  077 ; echo "${config.sshKey}" | base64 --decode > ~/.ssh/ansible_rsa)`)

        config.hostList.split(',').forEach(item => {
            if(item) {
                info('here -> ssh exec')

                execSync(`ssh -o StrictHostKeyChecking=no -i ~/.ssh/ansible_rsa ${config.user}@${item.trim()} 'ls -la'`)
            }
        })
    }

    async configAnsibleHosts(config: Input) {
        execSync(`mkdir ansible || true`)
        execSync('touch ansible/hosts')

        const hosts = config.hostList
        .split(',')
        .filter(item => item ? true: false)
        .map(item => `${item} ansible_ssh_private_key_file=~/.ssh/ansible_rsa`)
        .join('\n');

        const cat = await execSync(`cat << EOF > ansible/hosts
[deploy]
${hosts}
EOF`)

        info(cat.toString())
    }

    async applyPlaybook(config: Input) {
        const response = await execSync(`ansible-playbook ./playbook.yml -i ansible/hosts -u ${config.user} --extra-vars "${config.extraVars}"`)

        info(response.toString())
    }
}
