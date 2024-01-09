import * as pulumi from "@pulumi/pulumi";
import * as kubernetes from "@pulumi/kubernetes";

new kubernetes.helm.v3.Chart(
  'longhorn',
  {
    fetchOpts: {
      repo: 'https://charts.longhorn.io'
    },
    chart: 'longhorn',
    version: '1.5.3',

    transformations: [
      (resource) => {
        const exclude_jobs = ['longhorn-uninstall'];
        if (resource.kind === 'Job' && exclude_jobs.includes(resource.metadata.name)) {
          resource.apiVersion = 'v1';
          resource.kind = 'List';
        }
      }
    ],

    values: {
      helmPreUpgradeCheckerJob: {
        enabled: false
      }
    }
  }
);

//step 2: uncomment CustomResourcePatch

new kubernetes.apiextensions.CustomResourcePatch(
  `longhorn-node`,
  {
    apiVersion: 'longhorn.io/v1beta2',
    kind: 'Node',

    metadata: {
      name: 'kind-control-plane', //replace with the node name returned by `kubectl get nodes.longhorn.io
      annotations: {
        'pulumi.com/patchForce': 'true'
      }
    },

    spec: {
      allowScheduling: true,
      evictionRequested: false,
      instanceManagerCPURequest: 0,
      disks: {}
    }
  },
);

