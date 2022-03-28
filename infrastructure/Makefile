install:
	npm install
local: install
	cdk synth --no-staging ProxyServerStack > template.yaml
	sam local start-api -p 5000
	