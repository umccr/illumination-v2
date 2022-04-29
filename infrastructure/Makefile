install:
	brew tap aws/tap
	brew install aws-sam-cli
	yarn
local: install
	cdk synth --no-staging ProxyServerStack > template.yaml
	sam local start-api --warm-containers EAGER -p 5000
