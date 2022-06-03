# ManulifeMOVE Backend Coding Assignment #

__Version 1.1.0__

## Background

We are an online fashion store start-up, we have lot of user (anonymous) body data from our day to day sale. We are now going to dig into the value of those data, but sadly, we found that the original data is stored in CSV format. And yes, all the data. So now you are going to implement a service to save those data!

## Requirements

Please implement one or more RESTful services, which allow CSV data to flow in and have a way to query the data out as JSON format.

## Expected CSV data format

```
USER_NAME,AGE,HEIGHT,GENDER,SALE_AMOUNT,LAST_PURCHASE_DATE
John Doe,29,177,M,21312,2020-11-05T13:15:30Z
Jane Doe,32,187,f,5342,2019-12-05T13:15:30+08:00 …
```

## APIs to implement

• /sales/record
To receive the data in CSV format. Data validation is mandatory.

• /sales/report
To query data with JSON format response.
User should be able to query with date inputs (single date or date range).







## Installation

This program is written in nodejs. Visit this [link](https://nodejs.org/en/) and download the installer.
Use the following command to install dependencies

	$ npm install

You will also need to install mongodb for the program to run. Visit this [link](https://www.mongodb.com/docs/manual/installation/) and download mongodb.

After installing and have mongodb running in your instance, please edit **./src/config/var.js** to set the mongodb ip and port.

## Running the program

    $ npm start

## Run all test

    Use the following command to run all test 

    $ npm test

    Use the following command to run a special test to test uploading large file (i.e. file size > 1 GB). It will take around 20 mins to insert 1GB data

    $ npm run test-large-file

    Before running the test above, use the following command to generate a large csv file for testing. You will also need to remove the skip function in line 7 of ./src/api/helper/test_upload_large_file.test.js

    $ npm run generate-test-data

## Deploy to production
    
Use the following command to deploy to production environment with docker and docker compose

    $ . deploy.sh

You may edit the configuration of the docker in the file **docker-compose.yml**

The default port for the service is set to **5001**


## API

The server is written in **nodejs** using **express**. All data is stored into **mongodb**.

There are only two apis in this service.

1. The first api will be **POST /sales/record**

- This api will only accept form-data as request body
- This api only accepts csv file.
- The file must have a key = "**file**" in the form-data
- The csv file must follow the format specified above, otherwise server will return error message
- If any row of the csv is invalid, the file will not be processed.


2. The second api will be **GET /sales/report**

- This api will return the sales record in JSON format as follows:
```
{
    "status": 200,
    "errno": 0,
    "success": true,
    "message": "ok",
    "data": [
        {
            "_id": "6299acd9398c97a749084ed7",
            "USER_NAME": "Jane Doe",
            "AGE": 32,
            "HEIGHT": 187,
            "GENDER": "F",
            "SALE_AMOUNT": 5342,
            "LAST_PURCHASE_DATE": "2019-12-05T05:15:30.000Z"
        },
       ......
    ],
    "total": 18
}
```
- If no query type is specified, this api will return all records
- If not specified, the default number of records per api call is 1000 and skipping 0 records. 
- You may set the limit and number of skip with quert string of "limit" and "skip". An example will be **GET /sales/report?limit=2000&skip=2000**
- Query can be **single** or **range**
- All date must be in yyyy-mm-dd format, otherwise server will return error messgae
- To query records of specific date an example url will be **GET /sales/report?type=single&date=2020-01-01**
- To query records of specific date range an example url will be **GET /sales/report?type=range&from=2019-11-05&to=2019-12-05**

## Error

All error response will follow the below format
```
{
    "status": 404,
    "errno": 40400,
    "success": false,
    "message": "Not found/ Invalid URL"
}
```
- **status** specify the response status code
- **errno** specify the type of the error
- **success** specify whether the api is success or not
- **message** specify the details of the error


