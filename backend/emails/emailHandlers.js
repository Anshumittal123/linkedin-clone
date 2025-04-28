import { mailtrapClient, sender } from "../lib/mailtrap.js"
import {createWelcomeEmailTemplate, createCommentNotificationEmailTemplate, createConnectionAcceptedEmailTemplate} from './emailTemplates.js'

export const sendWelcomeEmail = async (email, name, profileUrl)=>{
    const recipient = [{email}]

    try{
        const response = await  mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Welcome to IACNetworkHub",
            html: createWelcomeEmailTemplate(name, profileUrl),
            category: "Welcome",
        })

        console.log("Welcome Email sent successfully!!", response);
    } catch (error) {   
        throw error;
    }
}

export const sendCommentNotificationEmail = async (
    recipientEmail,
    recipientName,
    commenterName,
    postUrl,
    commentContent
)=>{
    const recipient = [{email: recipientEmail}]; 

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "New Comment on Your Post",
            html: createCommentNotificationEmailTemplate(recipientName, commenterName, postUrl, commentContent),
            category: "Comment_notification",
        })

        console.log("Comment notification email sent successfully!!", response);
    } catch (error) {
        console.log("Error sending comment notification email: ", error);
        throw error;
    }
}

export const sendConnectionAcceptedEmail = async (
    senderEmail,
    senderName,
    recipientName,
    profileUrl
)=>{
    const recipient = [{email: senderEmail}];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: `${recipientName} has accepted your connection request.}`,
            html: createConnectionAcceptedEmailTemplate(senderName, recipientName, profileUrl),
            category: "Connection_accepted",
        })

        console.log("Connection accepted email sent successfully!!", response);
    } catch (error) {
        console.log("Error sending connection accepted email: ", error);
        throw error;    
    }
}