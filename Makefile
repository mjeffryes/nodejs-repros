WORKING_DIR := $(shell pwd)

.pulumi/bin/pulumi: .pulumi/version
	curl -fsSL https://get.pulumi.com | HOME=$(WORKING_DIR) sh -s -- --version $$(cat .pulumi/version)
	pulumi version | sed "s/^v//" > .pulumi/version #pin the version after downloading

.pulumi/version:
	mkdir -p .pulumi
	echo -n latest > $@

