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

Message
{
  "messageId":48124587452, (64 bit integer)
  "recipient":"15554442233",
  "message":"aGVsbG8gc2VydmVy",
  "acceptedTimestamp":"2013-09-20 12:12:22.501Z",
  "submittedToCarrierTimestamp":"2013-09-20 12:12:23.000Z",
  "carrierAcceptedTimestamp":"2013-09-20 12:12:23.900Z",
  "finalizedTimestamp":"2013-09-20 12:12:26.101Z",
  "messageStatus":4
}

NOTE: Timestamps are in UTC
```
## To send a message to your device
Content not yet available

## To view historical messages from your device
To view historical messages, make an HTTP GET request to the following web service endpoint.
```
GET https://dc-api.racowireless.com/messages
```
Use the following optional parameters to filter your data:

####$startDate
$startDate indicates a DateTime that historical messages should be filtered from.
```
GET https://dc-api.racowireless.com/messages?$startDate=
```

####$endDate
$endDate indicates a DateTime that historical messages should be filtered to.
```
GET https://dc-api.racowireless.com/messages?$endDate=
```

####$identifier
$identifier is a Unique ID that you have provided to identify your device.
```
GET https://dc-api.racowireless.com/messages?$identifier=
```

####$page (default = 1)
$page indicates how many messages to skip in the list.
```
GET https://dc-api.racowireless.com/messages?$page=
```

####$pageSize (default = 25)
$pageSize indicates how many messages to take from the list.
```
GET https://dc-api.racowireless.com/messages?$pageSize=
```
