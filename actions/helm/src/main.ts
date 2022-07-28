import YAML from 'yaml';
import * as fs from 'fs';
import {execSync} from 'child_process';
import * as core from '@actions/core';

import { Chart } from './interfaces/chart.interface';
import { Values } from './interfaces/values.interface';
import ConsulHelper from './utils/consul';


function getConfig() {
    const config = {
        chartName: core.getInput('chart_name'),
        workDir: core.getInput('work_dir'),
        consul: {
            host: core.getInput('consul_host'),
            token: core.getInput('consul_token'),
        },
        configPath: core.getInput('config_path'),
        dockerImage: core.getInput('docker_image'),
        namespace: core.getInput('namespace')
    }

    return config;
}

async function run(): Promise<void> {
    const config = getConfig();

    process.chdir(config.workDir)

    const consul = new ConsulHelper(config.consul);

    const configStr = await consul.DownloadFromConsul(config.configPath);

    const jsonConfig: {values: Values, chart: Chart} = JSON.parse(configStr);

    jsonConfig.values.image.name = config.dockerImage;

    const values = new YAML.Document();
    const chart = new YAML.Document();

    // @ts-ignore
    values.contents = jsonConfig.values;
     // @ts-ignore
    chart.contents = jsonConfig.chart;

    fs.writeFileSync('values.yaml', values.toString());
    fs.writeFileSync('Chart.yaml', chart.toString());

    execSync(`helm upgrade ${config.chartName} ./ --install -n ${config.namespace}`);
}

run().catch(e => core.setFailed(e.message));
