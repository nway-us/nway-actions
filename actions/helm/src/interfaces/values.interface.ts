export interface Values {
    replicaCount:       number;
    image:              Image;
    imagePullSecrets:   any[];
    serviceAccountName: string;
    configMapName:      string;
    container:          Container;
    selectorLabels:     Ingress;
    podAnnotations:     Ingress;
    podSecurityContext: Ingress;
    securityContext:    SecurityContext;
    service:            Service;
    resources:          Resources;
    autoscaling:        Autoscaling;
    ingress:            Ingress;
}

export interface Autoscaling {
    enabled:                           boolean;
    minReplicas:                       number;
    maxReplicas:                       number;
    targetCPUUtilizationPercentage:    number;
    targetMemoryUtilizationPercentage: number;
}

export interface Container {
    name:           string;
    port:           number;
    livenessProbe:  string;
    readinessProbe: string;
}

export interface Image {
    name:       string;
    pullPolicy: string;
}

export interface Ingress {
}

export interface Resources {
    limits:   Limits;
    requests: Limits;
}

export interface Limits {
    cpu:    string;
    memory: string;
}

export interface SecurityContext {
    capabilities:           Capabilities;
    readOnlyRootFilesystem: boolean;
    runAsNonRoot:           boolean;
    runAsUser:              number;
}

export interface Capabilities {
    drop: any[];
}

export interface Service {
    name: string;
    type: string;
    port: number;
}
