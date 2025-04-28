import { mailtrapClient, sender } from "../lib/mailtrap.js"
import {createWelcomeEmailTemplate, createCommentNotificationEmailTemplate} from './emailTemplates.js'

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
    const recipient = [{recipientEmail}]; // may be this will create an error. TODO: Debug this line after

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
