import awsSesConfig from 'aws-sdk'

// Configure AWS SDK
awsSesConfig.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID || '', // Access key from environment variables
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '', // Secret key from environment variables
	region: 'us-east-1', // Set your region (e.g., us-east-1)
})

export default awsSesConfig
