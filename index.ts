import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

const _ingresskNamespace = new k8s.core.v1.Namespace(
  'ingress',
  { metadata: { name: 'ingress' } },
//  { provider: k8sProvider },
)

//const _ingressNginxValues = new pulumi.asset.FileAsset('charts/ingress-nginx/values.yaml')
const _ingressNginxRelease = new k8s.helm.v3.Release(
  'ingress-nginx',
  {
    name: 'ingress-nginx',
    namespace: _ingresskNamespace.metadata.name,
    chart: 'ingress-nginx',
    repositoryOpts: { repo: 'https://kubernetes.github.io/ingress-nginx' },
    version: '4.8.3',
    //valueYamlFiles: [_ingressNginxValues],
  },
  { /*provider: k8sProvider, */dependsOn: [_ingresskNamespace] },
)
