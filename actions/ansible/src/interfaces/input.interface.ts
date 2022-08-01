export interface Input {
    hostList: string,
    consul: {
        host: string,
        token: string,
    },
    configPath: string,
    sshKey: string,
    user: string
}
