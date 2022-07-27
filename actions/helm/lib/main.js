"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yaml_1 = __importDefault(require("yaml"));
const fs = __importStar(require("fs"));
const core = __importStar(require("@actions/core"));
const consul_1 = __importDefault(require("./utils/consul"));
function getConfig() {
    const config = {
        chartName: core.getInput('chart_name'),
        workDir: core.getInput('work_dir'),
        consul: {
            host: core.getInput('consul_host'),
            token: core.getInput('consul_token'),
        },
        configPath: core.getInput('config_path')
    };
    return config;
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const execSync = require('exec-sync');
        const config = getConfig();
        process.chdir(config.workDir);
        const consul = new consul_1.default(config.consul);
        const configStr = yield consul.DownloadFromConsul(config.configPath);
        const jsonConfig = JSON.parse(configStr);
        const values = new yaml_1.default.Document();
        const chart = new yaml_1.default.Document();
        // @ts-ignore
        values.contents = jsonConfig.values;
        // @ts-ignore
        chart.contents = jsonConfig.chart;
        fs.writeFileSync('values.yaml', values.toString());
        fs.writeFileSync('Chart.yaml', chart.toString());
        execSync(`helm upgrade ${config.chartName} ./`);
    });
}
run().catch(e => core.setFailed(e.message));
