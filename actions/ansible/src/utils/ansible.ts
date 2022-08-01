
import { execSync } from 'child_process';

import { Input } from "../interfaces/input.interface";

export class Ansible {

    configSshKey(config: Input) {
        execSync('mkdir -p ~/.ssh')

        const hosts = config.hostList.split(',').join('\n');

        execSync(`echo "${hosts}" >> ~/.ssh/known_hosts`)

        execSync(`(umask  077 ; echo ${config.sshKey} | base64 --decode > ~/.ssh/id_rsa)`)
    }

    configAnsibleHosts(config: Input) {
        execSync(`sudo mkdir /etc/ansible`)

        const hosts = config.hostList.split(',').join('\n');

        execSync(`echo -en '[deploy]\n ${ hosts }' > /etc/ansible/hosts`)
    }

    applyPlaybook(config: Input) {
        execSync(`/root/.local/bin/ansible-playbook ./playbook.yml -u ${config.user} --extra-vars "variable_host=deploy"`)
    }
}
