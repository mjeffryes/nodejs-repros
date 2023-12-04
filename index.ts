import * as pulumi from "@pulumi/pulumi";
import * as azure_native from "@pulumi/azure-native";

const resourceGroup = new azure_native.resources.ResourceGroup("rg1");

const virtualNetworkCIDR = "10.200.0.0/16";
const virtualNetwork = new azure_native.network.VirtualNetwork("virtualNetwork", {
    addressSpace: {
        addressPrefixes: [virtualNetworkCIDR],
    },
    resourceGroupName: resourceGroup.name,
    virtualNetworkName: "vnet",
}, {ignoreChanges: ["subnets"]});

const subnet = new azure_native.network.Subnet("subnet", {
    addressPrefix: "10.200.0.0/16",
    resourceGroupName: resourceGroup.name,
    subnetName: "AzureFirewallSubnet",
    virtualNetworkName: virtualNetwork.name,
});
const publicIPAddress = new azure_native.network.PublicIPAddress("publicIPAddress", {
    dnsSettings: {
        domainNameLabel: "ipforfirewalltest",
    },
    location: "eastus",
    publicIpAddressName: "test-ip",
    resourceGroupName: resourceGroup.name,
    publicIPAllocationMethod: "Static",
    sku: { name: "Standard" },
});

const azureFirewall = new azure_native.network.AzureFirewall("azureFirewall", {
    applicationRuleCollections: [{
        action: {
            type: "Deny",
        },
        name: "apprulecoll",
        priority: 110,
        rules: [{
            description: "Deny inbound rule",
            name: "rule1",
            protocols: [{
                port: 443,
                protocolType: "Https",
            }],
            sourceAddresses: [
                "216.58.216.164",
                "10.0.0.0/24",
            ],
            targetFqdns: ["www.test.com"],
        }],
    }],
    azureFirewallName: "azurefirewall",
    ipConfigurations: [{
        name: "azureFirewallIpConfiguration",
        subnet: { id: subnet.id },
        publicIPAddress: { id: publicIPAddress.id },
    }],
    location: "East US",
    networkRuleCollections: [{
        action: {
            type: "Deny",
        },
        name: "netrulecoll",
        priority: 112,
        rules: [
            {
                description: "Block traffic based on source IPs and ports",
                destinationAddresses: ["*"],
                destinationPorts: [
                    "443-444",
                    "8443",
                ],
                name: "L4-traffic",
                protocols: ["TCP"],
                sourceAddresses: [
                    "192.168.1.1-192.168.1.12",
                    "10.1.4.12-10.1.4.255",
                ],
            },
        ],
    }],
    resourceGroupName: resourceGroup.name,
    sku: {
        name: "AZFW_VNet",
        tier: "Standard",
    },
    tags: {
        key1: "value1",
    },
    threatIntelMode: "Alert",
    zones: [],
});
