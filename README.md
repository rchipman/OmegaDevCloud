Omega DevCloud
=============

The Omega DevCloud provides a standardized and secure platform that enables web developers with an easy-to-use tool to communicate with virtually any device.  For more information, please visit http://racowireless.com/getstarted/.

To get started, you will need:
* An Omega Management Suite account
** To register for a free account please visit https://oms3.racowireless.com/#!/GetDevCloud
* An M2M/IoT device
** If you have an iOS or Android device, you can download the Omega DevCloud traffic generator by searching for "DevCloud" on the iOS app store or the Google Play store

## API Authorization
The API uses [Basic Authentication](http://en.wikipedia.org/wiki/Basic_access_authentication) with your PartnerId as the username, and  WebServiceKey as the password.

## To receive messages from your devices
To receive a message, make an HTTP GET request to the web service endpoint.  Your request will be held open until a message is available, or for {30} seconds (whichever comes first).  If you wish to receive messages as quickly as possible, your solution should ‘infinite loop’ this HTTP request.

```
GET https://dc-api.racowireless.com/receive

{
	"messageId" : "27e7acc1-188e-4fae-9ac7-10aac55e8ea5",
	"rawData" : "base64EncodedBinaryOrASCII",
	"binary" : false,
	"messageDefinition" : "MyMessageDefinition",
	"details" : {
		"deviceIdentifier" : "ec0eb2718fedd205",
		"timestamp" : "1411569341355",
		"operatingSystem" : "Android 4.4.4",
		"latitude" : 39.2445589,
		"longitude" : -84.3848572,
	}
	"received" : "2014-09-24T14:35:42.8497395Z",
	"ip" : "128.156.99.51",
	"port" : 55555,
	"collector" : "My Collector"
}

NOTE: Timestamps are in UTC
```
## To send a message to your device
To send a message to your device, make an HTTP POST request to the following web service endpoint.
```
POST https://dc-api.racowireless.com/send
```
####What the /send API does
This API is used to send a message to a specific device. This message will not be pushed to the device directly but will be placed into a message queue until that device connects to the network. Once the device connects to the network, all messages within the queue will be relayed to the device.

The HTTP POST request takes a JSON object with the following properties:

```
{
    "deviceId": "234614313461346aga"
    "expirationTime": "2014/09/17 00:00:00",
    "message": "+RESP:SET,25.677,-123.444,0,1,1,0,1",
}
```
####When to use the /send API
It is not recommended to use this API when a device requires a message immediately but rather when you wish to convey a message to a device the next time it connects to the server.

####deviceId - `string`
The `deviceId` property is a required property that will tell server where to send your message.  It must match a previously registered hardware device's deviceId in order for the message to be delivered successfully.

Example:
```
"deviceId": "234614313461346aga"
```

#### expirationTime - `string`
The `expirationTime` property is an optional property that takes a `string` with the time and date that you wish for the message to no longer be sent to your device. The `string` can be either a `DateTime` formatted string, or the number of seconds as an `int`. If you opt to use a `DateTime` encoded string, it can be created by using the following format: <code>YYYY/MM/DD hh:mm:ss</code></p>
Example:

```
"expirationTime": "2014/09/17 00:00:00"
```
or
```
"expirationTime": "18000" // 5 hours in seconds
```

####message - `string`
the `message` property is a required property that takes a `string` that is sent to your device.  If your device expects **binary** rather than **unicode**, you will want to the use a base64 encoded byte array of the data that you wish to send.

Example for unicode:
```
"message": "+RESP:SET,25.677,-123.444,0,1,1,0,1"
```

Example for binary:
```
"message": "NjE0OjkzMENDMEJFNTYzMEMyM0VDNTZBNjZFNkQzMDVGNDc1==="
```

###Responses from the /send API
```
{
    "messageId": "29D71ECC-697D-41DC-8DED-40F68E117B66",
    "Expiration": "2014/09/17 00:00:00",
    "StatusId": 3,
    "Status": "Message Sent"
}
```
####Possible Statuses:
0. Device Not Found. Occurs when the deviceId fromt he incoming message does not match a registered device on your account.
1. Expiration Exceeded. Occurs when the expiration time of the incoming message has been exceeded before the device can be contacted.
2. Message Not Sent. Occurs if there is an error saving the message to the message queue for the specified device.
3. Message Sent. Occurs when the message has been successfully queued.

## To view historical messages from your device
To view historical messages, make an HTTP GET request to the following web service endpoint.
```
GET https://dc-api.racowireless.com/messages
```
Use the following optional parameters to filter your data:

####startDate - `DateTime`
startDate indicates a `DateTime` that historical messages should be filtered from.
```
GET https://dc-api.racowireless.com/messages?startDate=
```

####endDate - `DateTime`
endDate indicates a `DateTime` that historical messages should be filtered to.
```
GET https://dc-api.racowireless.com/messages?endDate=
```

####deviceIdentifier - `string`
deviceIdentifier is a Unique ID that you have provided to identify your device.
```
GET https://dc-api.racowireless.com/messages?deviceIdentifier=
```

####page - `int` (default = 1)
page indicates how many messages to skip in the list.
```
GET https://dc-api.racowireless.com/messages?page=
```

####pageSize - `int` (default = 25)
pageSize indicates how many messages to take from the list.
```
GET https://dc-api.racowireless.com/messages?pageSize=
```
####desc - `bool` (default = false)
desc indicates if the results should be ordered in descending or not by received time.
```
GET https://dc-api.racowireless.com/messages?desc=
```
