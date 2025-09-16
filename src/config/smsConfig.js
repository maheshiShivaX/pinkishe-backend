const axios = require('axios');

const sendSMS = async (SmsData) => {
    const url = `https://sms.par-ken.com/api/smsapi` +
      `?key=38b63bd9ae7c93f35cc99af8832f50b7` +
      `&route=1` +
      `&sender=PINKFD` +  
      `&number=${SmsData.mobileno}` +
      `&sms=${encodeURIComponent(SmsData.smsbody)}` +
      `&templateid=1707174721349664984`;  // fixed template ID
  
    try {
      const response = await axios.get(url);
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error sending SMS:", error.message);
    }
  };



const sendLowStockAlertSMS = async (mobileNumbers, machineId) => {
    const senderId = "PINKFD";
    const apiKey = "38b63bd9ae7c93f35cc99af8832f50b7";
    const baseUrl = "https://sms.par-ken.com/api/smsapi";


    const whatsappApiKey = "25b2711753ad915c8010b954a735674d";
    const whatsappBaseUrl = "https://chat.bol7.com/api/whatsapp/SendTemplate";

    // English SMS
    const englishBody = `Refill Alert: Pad stock in Vending Machine No. ${machineId} is low. Please refill it urgently. – Pinkishe Foundation`;
    const englishTemplateId = "1707174677483008831";

    // Hindi SMS
    const hindiBody = `वेंडिंग मशीन नंबर ${machineId} में पैड कम हैं, तुरंत भरें| पिंकिश फाउंडेशन`;
    const hindiTemplateId = "1707174677478112953";


    console.log("📟 Machine ID:", machineId);
    console.log("📱 Mobile Numbers:", mobileNumbers);

    for (const number of mobileNumbers.filter(Boolean)) {
        // Send English SMS
        const englishUrl = `${baseUrl}?key=${apiKey}&route=1&sender=${senderId}&number=${number}&sms=${encodeURIComponent(englishBody)}&templateid=${englishTemplateId}`;

        try {
            const engRes = await axios.get(englishUrl);
            console.log(`✅ English SMS sent to ${number}:`, engRes.data);
        } catch (error) {
            console.error(`❌ Failed to send English SMS to ${number}:`, error.message);
        }

        // Send Hindi SMS
        const hindiUrl = `${baseUrl}?key=${apiKey}&route=1&sender=${senderId}&number=${number}&sms=${encodeURIComponent(hindiBody)}&templateid=${hindiTemplateId}`;

        try {
            const hinRes = await axios.get(hindiUrl);
            console.log(`✅ Hindi SMS sent to ${number}:`, hinRes.data);
        } catch (error) {
            console.error(`❌ Failed to send Hindi SMS to ${number}:`, error.message);
        }


        // Send WhatsApp Message
        const whatsappUrl = `${whatsappBaseUrl}?sender=Pinkishe&to=${number}&templateid=1894194418000583&bodyVariables=${machineId}`;

        console.log("printing whatapp url here:",whatsappUrl)

        try {
            const waRes = await axios.get(whatsappUrl);
            console.log(`✅ WhatsApp message sent to ${number}:`, waRes.data);
        } catch (error) {
            console.error(`❌ Failed to send WhatsApp message to ${number}:`, error.message);
        }
    }
};



module.exports = {sendSMS,sendLowStockAlertSMS};

// Example usage:
const SmsData = {
    sendorId: "ABCDEF",
    mobileno: "9876543210",
    smsbody: "Your OTP is 123456",
    dltno: "120716XXXXXX"
};

sendSMS(SmsData);
