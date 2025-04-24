'''
this script assumes that we have a csv file with the following column names:
   - clerkUserID (if not it's fine the first function run will generate a uuid for each business)
        - if the businesses already have valid clerk userid's and there is a column called clerkUserID with the values in csv, 
        comment out line 218 'setAllClerk(filePath)'
   - businessName (HAS TO BE UNIQUE FOR EVERY BUSINESS OR INSERTION WILL NOT WORK)
   - businessType
   - businessOwner
   - website
   - address	
   - description	
   - pointOfContactName
   - pointOfContactEmail
   - pointOfContactPhoneNumber
   - instagram
   - twitter	
   - facebook
Change filepath to actual path to file on line 30
'''

import pandas as pd
from pymongo import MongoClient
import os
from typing import Optional, get_origin, get_args, Union
from dataclasses import dataclass, fields, MISSING, asdict
from dotenv import load_dotenv
import uuid


filePath = 'src/database/hba -test.csv'

"""
Class definitions
"""
@dataclass
class Poc:
    Name: str
    PhoneNumber: int
    Email: str

    @classmethod
    def from_row(cls, name, phone, email):
        return cls(Name=name, PhoneNumber=phone, Email=email)

@dataclass
class Handles:
    IG: Optional[str] = None
    twitter: Optional[str] = None
    FB: Optional[str] = None

    @classmethod
    def from_row(cls, ig=None, twitter=None, fb=None):
        return cls(IG=ig, twitter=twitter, FB=fb)

@dataclass
class Business:
    clerkUserID: str
    businessName: str
    businessType: str
    businessOwner: str
    website: str
    address: str
    pointOfContact: Poc
    socialMediaHandles: Optional[Handles]
    description: str
    logoUrl: Optional[str]
    bannerUrl: Optional[str]

    @classmethod
    def from_row(cls, row):
        poc = Poc.from_row(
            row.get("pointOfContactName"),
            row.get("pointOfContactPhoneNumber"),
            row.get("pointOfContactEmail")
        )
        handles = Handles.from_row(
            row.get("instagram"),
            row.get("twitter"),
            row.get("facebook")
        )
        return cls(
            clerkUserID=row.get("clerkUserID", "Not Yet Set"),
            businessName=row["businessName"],
            businessType=row["businessType"],
            businessOwner=row["businessOwner"],
            website=row["website"],
            address=row["address"],
            pointOfContact=poc,
            socialMediaHandles=handles,
            description=row["description"],
            logoUrl=row.get("logoUrl"),
            bannerUrl=row.get("bannerUrl")
        )
    
"""
Function to determine which fields are optional used in following function
"""
def is_optional(annotation):
    return get_origin(annotation) is Optional or (
        get_origin(annotation) is Union and type(None) in get_args(annotation)
    )

"""
Determines which fields are required
"""
def get_required_fields(cls):
    req_fields = []
    for f in fields(cls):
        if f.default is MISSING and f.default_factory is MISSING:
            if not is_optional(f.type):
                req_fields.append(f.name)
    return req_fields


def is_missing(value):
    return pd.isna(value) or value in [None, "", "nan"]

"""
Checks to see which required fields are missing values
"""
def check_required_fields_from_row(row, cls, prefix="", field_map=None):
    missing = []
    required_fields = get_required_fields(cls)

    for field in required_fields:
        if field != 'pointOfContact':
            csv_col = field_map.get(field) if field_map else prefix + field
            if csv_col not in row or is_missing(row[csv_col]):
                missing.append(csv_col)
    return missing    


"""
This function will print out the data for each business
"""
def printData(path):
    df = pd.read_csv(path)
    for index, row in df.iterrows():
        print("business number", index)

        print(row)

"""
Function to add a column for clerkUserID and gives every business a unique uuid if it doesn't already have a value there
"""
def setAllClerk(path):
    df = pd.read_csv(path)
    df['clerkUserID'] = df['clerkUserID'].apply(
        lambda x: f"placeholder-{uuid.uuid4()}" if pd.isna(x) else x
    )
    df.to_csv(path, index=False)
            

"""
Main function to actually add businesses to Mongo, it will go through the csv file row by row
It'll check if the current business can be added to mongo (has all required fields) and if not will print an error message

"""
def add_to_mongo(path):
    load_dotenv(dotenv_path=".env.local")
    uri = os.environ.get("MONGO_URI")
    client = MongoClient(uri)
    db = client['hba']
    collection = db['businesses']
    df = pd.read_csv(path)

    businesses = []

    for index, row in df.iterrows():

        row = row.to_dict()
        missing_main = check_required_fields_from_row(row, Business)
        missing_poc = check_required_fields_from_row(row, Poc, prefix="pointOfContact")
        all_missing = missing_main + missing_poc

        if all_missing:
            print(f"❌ Skipping '{row.get('businessName', '[Unknown]')}'. Missing fields: {', '.join(all_missing)}")
            continue

        try:
            poc = Poc(
                Name=row["pointOfContactName"],
                PhoneNumber=int(row["pointOfContactPhoneNumber"]),
                Email=row["pointOfContactEmail"]
            )

            handles = Handles(
                IG=row.get("instagram"),
                twitter=row.get("twitter"),
                FB=row.get("facebook")
            )

            business = Business(
                clerkUserID=row.get("clerkUserID", uuid.uuid4()),
                businessName=row["businessName"],
                businessType=row["businessType"],
                businessOwner=row["businessOwner"],
                website=row["website"],
                address=row["address"],
                pointOfContact=poc,
                socialMediaHandles=handles,
                description=row["description"],
                logoUrl=row.get("logoUrl"),
                bannerUrl=row.get("bannerUrl")
            )

            businesses.append(asdict(business))
            print(f"✅ Inserted: {business.businessName} into business list to be added")

        except Exception as e:
            print(f"❌ Failed to insert {row.get('businessName', '[Unknown]')}: {e}")
    if len(businesses) > 0:
        collection.insert_many(businesses)
    client.close()



setAllClerk(filePath) # you can comment this line out if the csv file already has actual clerkid's for every business
add_to_mongo(filePath)
