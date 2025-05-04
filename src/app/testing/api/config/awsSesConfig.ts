// Import the necessary packages from AWS SDK v3
import { SESClient } from '@aws-sdk/client-ses';
import { SendEmailCommand } from '@aws-sdk/client-ses';

// Create an SES client
const sesClient = new SESClient({
    region: 'us-east-1', // Set your region
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '', // Access key from environment variables
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '' // Secret key from environment variables
    }
});

export default sesClient;

// Example function to send an email
// export const sendEmail = async (emailParams) => {
//     const command = new SendEmailCommand(emailParams);

//     try {
//         const response = await sesClient.send(command);
//         console.log('Email sent successfully:', response);
//         return response;
//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw error;
//     }
// };
