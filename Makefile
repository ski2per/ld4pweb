#.PHONY: test e2e-test cover gofmt gofmt-fix header-check clean tar.gz docker-push release docker-push-all flannel-git

# Registry used for publishing images
REGISTRY?=docker.cetcxl.local/ldapman-web
ENV := ".env.production"

# Default tag and architecture. Can be overridden
TAG?=$(shell git describe --tags --dirty)
ifeq ($(TAG),)
	TAG=latest
endif

ifeq ($(findstring dirty,$(TAG)), dirty)
	TAG=latest
endif


clean:
	@echo "clean"

## Create a docker image on disk for a specific arch and tag
image:
	@cp $(ENV) "$(ENV).bak"
	@sed -i "s/LDAPWEB_VERSION/$(TAG)/" $(ENV)
	docker build --no-cache -f Dockerfile -t $(REGISTRY):$(TAG) .
	@mv "$(ENV).bak" $(ENV)

push: image
	docker push $(REGISTRY):$(TAG)

all:
	: '$(ENV)'
