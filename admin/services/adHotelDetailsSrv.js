admin.service('ADHotelDetailsSrv',['$http', '$q', function($http, $q){
	
	var _this = this;

	this.fetch = function(){
		_this.data = {
        "id": 1,
        "chains": [
            {
                "id": 21,
                "name": "123"
            },
            {
                "id": 11,
                "name": "aa"
            },
            {
                "id": 3,
                "name": "Admin Chain"
            },
            {
                "id": 18,
                "name": "ASDF"
            },
            {
                "id": 16,
                "name": "BETHESDA"
            },
            {
                "id": 10,
                "name": "chain abc"
            },
            {
                "id": 38,
                "name": "chain demo"
            },
            {
                "id": 39,
                "name": "chain demo 1"
            },
            {
                "id": 40,
                "name": "chain demo 11"
            },
            {
                "id": 41,
                "name": "chain demo 118"
            },
            {
                "id": 47,
                "name": "Chain Five"
            },
            {
                "id": 46,
                "name": "Chain Four"
            },
            {
                "id": 19,
                "name": "chain name"
            },
            {
                "id": 45,
                "name": "Chain Three"
            },
            {
                "id": 2,
                "name": "Chain Two"
            },
            {
                "id": 56,
                "name": "CHAS"
            },
            {
                "id": 26,
                "name": "CHN"
            },
            {
                "id": 42,
                "name": "DEMO"
            },
            {
                "id": 23,
                "name": "DEMO CHAIN"
            },
            {
                "id": 24,
                "name": "DEMO CHAIN 2"
            },
            {
                "id": 25,
                "name": "DEMO CHAIN THREE"
            },
            {
                "id": 53,
                "name": "EMPCHN"
            },
            {
                "id": 22,
                "name": "fdghdfgh"
            },
            {
                "id": 4,
                "name": "fghfghfgh updated"
            },
            {
                "id": 61,
                "name": "Hiranandani Hotels Group"
            },
            {
                "id": 5,
                "name": "Hotel Chain A101"
            },
            {
                "id": 44,
                "name": "JOS HOTELS"
            },
            {
                "id": 72,
                "name": "Micros Systems Inc."
            },
            {
                "id": 20,
                "name": "mnd"
            },
            {
                "id": 67,
                "name": "NOFTP"
            },
            {
                "id": 36,
                "name": "qqq"
            },
            {
                "id": 68,
                "name": "REFRESH1"
            },
            {
                "id": 70,
                "name": "shiju-chain name"
            },
            {
                "id": 73,
                "name": "SNTCHN"
            },
            {
                "id": 1,
                "name": "StayNTouch Demo Chain"
            },
            {
                "id": 43,
                "name": "test chain"
            },
            {
                "id": 65,
                "name": "Test Chain 001"
            },
            {
                "id": 57,
                "name": "TST"
            },
            {
                "id": 69,
                "name": "WORKING"
            },
            {
                "id": 71,
                "name": "Yotel Hotels"
            },
            {
                "id": 52,
                "name": "ZOEHotels"
            }
        ],
        "brands": [
            {
                "id": 15,
                "name": "001 chain"
            },
            {
                "id": 17,
                "name": "Beer hotels"
            },
            {
                "id": 5,
                "name": "Brand For Chain One Edited"
            },
            {
                "id": 1,
                "name": "Brand One"
            },
            {
                "id": 3,
                "name": "Brand Three"
            },
            {
                "id": 2,
                "name": "Brand Two"
            },
            {
                "id": 20,
                "name": "Fidelio Technologies"
            },
            {
                "id": 11,
                "name": "qqq brand"
            },
            {
                "id": 4,
                "name": "qwqw"
            },
            {
                "id": 6,
                "name": "test"
            },
            {
                "id": 12,
                "name": "Test 123456789"
            },
            {
                "id": 18,
                "name": "test 56"
            },
            {
                "id": 10,
                "name": "Test brand 987"
            },
            {
                "id": 9,
                "name": "Test Chain brand 001"
            },
            {
                "id": 8,
                "name": "Test test test test"
            }
        ],
        "countries": [
            {
                "id": 1,
                "name": "Afghanistan"
            },
            {
                "id": 2,
                "name": "Aland Islands"
            },
            {
                "id": 3,
                "name": "Albania"
            },
            {
                "id": 4,
                "name": "Algeria"
            },
            {
                "id": 5,
                "name": "American Samoa"
            },
            {
                "id": 6,
                "name": "Andorra"
            },
            {
                "id": 7,
                "name": "Angola"
            },
            {
                "id": 8,
                "name": "Anguilla"
            },
            {
                "id": 9,
                "name": "Antarctica"
            },
            {
                "id": 10,
                "name": "Antigua and Barbuda"
            },
            {
                "id": 11,
                "name": "Argentina"
            },
            {
                "id": 12,
                "name": "Armenia"
            },
            {
                "id": 13,
                "name": "Aruba"
            },
            {
                "id": 14,
                "name": "Australia"
            },
            {
                "id": 15,
                "name": "Austria"
            },
            {
                "id": 16,
                "name": "Azerbaijan"
            },
            {
                "id": 17,
                "name": "Bahamas"
            },
            {
                "id": 18,
                "name": "Bahrain"
            },
            {
                "id": 19,
                "name": "Bangladesh"
            },
            {
                "id": 20,
                "name": "Barbados"
            },
            {
                "id": 21,
                "name": "Belarus"
            },
            {
                "id": 22,
                "name": "Belgium"
            },
            {
                "id": 23,
                "name": "Belize"
            },
            {
                "id": 24,
                "name": "Benin"
            },
            {
                "id": 25,
                "name": "Bermuda"
            },
            {
                "id": 26,
                "name": "Bhutan"
            },
            {
                "id": 27,
                "name": "Bolivia, Plurinational State Of"
            },
            {
                "id": 28,
                "name": "Bonaire, Sint Eustatius and Saba"
            },
            {
                "id": 29,
                "name": "Bosnia and Herzegovina"
            },
            {
                "id": 30,
                "name": "Botswana"
            },
            {
                "id": 31,
                "name": "Bouvet Island"
            },
            {
                "id": 32,
                "name": "Brazil"
            },
            {
                "id": 33,
                "name": "British Indian Ocean Territory"
            },
            {
                "id": 34,
                "name": "Brunei Darussalam"
            },
            {
                "id": 35,
                "name": "Bulgaria"
            },
            {
                "id": 36,
                "name": "Burkina Faso"
            },
            {
                "id": 37,
                "name": "Burundi"
            },
            {
                "id": 38,
                "name": "Cambodia"
            },
            {
                "id": 39,
                "name": "Cameroon"
            },
            {
                "id": 40,
                "name": "Canada"
            },
            {
                "id": 41,
                "name": "Cape Verde"
            },
            {
                "id": 42,
                "name": "Cayman Islands"
            },
            {
                "id": 43,
                "name": "Central African Republic"
            },
            {
                "id": 44,
                "name": "Chad"
            },
            {
                "id": 45,
                "name": "Chile"
            },
            {
                "id": 46,
                "name": "China"
            },
            {
                "id": 47,
                "name": "Christmas Island"
            },
            {
                "id": 48,
                "name": "Cocos (KEELING) Islands"
            },
            {
                "id": 49,
                "name": "Colombia"
            },
            {
                "id": 50,
                "name": "Comoros"
            },
            {
                "id": 51,
                "name": "Congo"
            },
            {
                "id": 52,
                "name": "Congo, The Democratic Republic Of The"
            },
            {
                "id": 53,
                "name": "Cook Islands"
            },
            {
                "id": 54,
                "name": "Costa Rica"
            },
            {
                "id": 55,
                "name": "Cote D'ivoire"
            },
            {
                "id": 56,
                "name": "Croatia"
            },
            {
                "id": 57,
                "name": "Cuba"
            },
            {
                "id": 58,
                "name": "Curacao"
            },
            {
                "id": 59,
                "name": "Cyprus"
            },
            {
                "id": 60,
                "name": "Czech Republic"
            },
            {
                "id": 61,
                "name": "Denmark"
            },
            {
                "id": 62,
                "name": "Djibouti"
            },
            {
                "id": 63,
                "name": "Dominica"
            },
            {
                "id": 64,
                "name": "Dominican Republic"
            },
            {
                "id": 65,
                "name": "Ecuador"
            },
            {
                "id": 66,
                "name": "Egypt"
            },
            {
                "id": 67,
                "name": "El Salvador"
            },
            {
                "id": 68,
                "name": "Equatorial Guinea"
            },
            {
                "id": 69,
                "name": "Eritrea"
            },
            {
                "id": 70,
                "name": "Estonia"
            },
            {
                "id": 71,
                "name": "Ethiopia"
            },
            {
                "id": 72,
                "name": "Falkland Islands (MALVINAS)"
            },
            {
                "id": 73,
                "name": "Faroe Islands"
            },
            {
                "id": 74,
                "name": "Fiji"
            },
            {
                "id": 75,
                "name": "Finland"
            },
            {
                "id": 76,
                "name": "France"
            },
            {
                "id": 77,
                "name": "French Guiana"
            },
            {
                "id": 78,
                "name": "French Polynesia"
            },
            {
                "id": 79,
                "name": "French Southern Territories"
            },
            {
                "id": 80,
                "name": "Gabon"
            },
            {
                "id": 81,
                "name": "Gambia"
            },
            {
                "id": 82,
                "name": "Georgia"
            },
            {
                "id": 83,
                "name": "Germany"
            },
            {
                "id": 84,
                "name": "Ghana"
            },
            {
                "id": 85,
                "name": "Gibraltar"
            },
            {
                "id": 86,
                "name": "Greece"
            },
            {
                "id": 87,
                "name": "Greenland"
            },
            {
                "id": 88,
                "name": "Grenada"
            },
            {
                "id": 89,
                "name": "Guadeloupe"
            },
            {
                "id": 90,
                "name": "Guam"
            },
            {
                "id": 91,
                "name": "Guatemala"
            },
            {
                "id": 92,
                "name": "Guernsey"
            },
            {
                "id": 93,
                "name": "Guinea"
            },
            {
                "id": 94,
                "name": "Guinea-Bissau"
            },
            {
                "id": 95,
                "name": "Guyana"
            },
            {
                "id": 96,
                "name": "Haiti"
            },
            {
                "id": 97,
                "name": "Heard Island and Mcdonald Islands"
            },
            {
                "id": 98,
                "name": "Holy See (VATICAN City State)"
            },
            {
                "id": 99,
                "name": "Honduras"
            },
            {
                "id": 100,
                "name": "Hong Kong"
            },
            {
                "id": 101,
                "name": "Hungary"
            },
            {
                "id": 102,
                "name": "Iceland"
            },
            {
                "id": 103,
                "name": "India"
            },
            {
                "id": 104,
                "name": "Indonesia"
            },
            {
                "id": 105,
                "name": "Iran, Islamic Republic Of"
            },
            {
                "id": 106,
                "name": "Iraq"
            },
            {
                "id": 107,
                "name": "Ireland"
            },
            {
                "id": 108,
                "name": "Isle Of Man"
            },
            {
                "id": 109,
                "name": "Israel"
            },
            {
                "id": 110,
                "name": "Italy"
            },
            {
                "id": 111,
                "name": "Jamaica"
            },
            {
                "id": 112,
                "name": "Japan"
            },
            {
                "id": 113,
                "name": "Jersey"
            },
            {
                "id": 114,
                "name": "Jordan"
            },
            {
                "id": 115,
                "name": "Kazakhstan"
            },
            {
                "id": 116,
                "name": "Kenya"
            },
            {
                "id": 117,
                "name": "Kiribati"
            },
            {
                "id": 118,
                "name": "Korea, Democratic People's Republic Of"
            },
            {
                "id": 119,
                "name": "Korea, Republic Of"
            },
            {
                "id": 120,
                "name": "Kuwait"
            },
            {
                "id": 121,
                "name": "Kyrgyzstan"
            },
            {
                "id": 122,
                "name": "Lao People's Democratic Republic"
            },
            {
                "id": 123,
                "name": "Latvia"
            },
            {
                "id": 124,
                "name": "Lebanon"
            },
            {
                "id": 125,
                "name": "Lesotho"
            },
            {
                "id": 126,
                "name": "Liberia"
            },
            {
                "id": 127,
                "name": "Libya"
            },
            {
                "id": 128,
                "name": "Liechtenstein"
            },
            {
                "id": 129,
                "name": "Lithuania"
            },
            {
                "id": 130,
                "name": "Luxembourg"
            },
            {
                "id": 131,
                "name": "Macao"
            },
            {
                "id": 132,
                "name": "Macedonia, The Former Yugoslav Republic Of"
            },
            {
                "id": 133,
                "name": "Madagascar"
            },
            {
                "id": 134,
                "name": "Malawi"
            },
            {
                "id": 135,
                "name": "Malaysia"
            },
            {
                "id": 136,
                "name": "Maldives"
            },
            {
                "id": 137,
                "name": "Mali"
            },
            {
                "id": 138,
                "name": "Malta"
            },
            {
                "id": 139,
                "name": "Marshall Islands"
            },
            {
                "id": 140,
                "name": "Martinique"
            },
            {
                "id": 141,
                "name": "Mauritania"
            },
            {
                "id": 142,
                "name": "Mauritius"
            },
            {
                "id": 143,
                "name": "Mayotte"
            },
            {
                "id": 144,
                "name": "Mexico"
            },
            {
                "id": 145,
                "name": "Micronesia, Federated States Of"
            },
            {
                "id": 146,
                "name": "Moldova, Republic Of"
            },
            {
                "id": 147,
                "name": "Monaco"
            },
            {
                "id": 148,
                "name": "Mongolia"
            },
            {
                "id": 149,
                "name": "Montenegro"
            },
            {
                "id": 150,
                "name": "Montserrat"
            },
            {
                "id": 151,
                "name": "Morocco"
            },
            {
                "id": 152,
                "name": "Mozambique"
            },
            {
                "id": 153,
                "name": "Myanmar"
            },
            {
                "id": 154,
                "name": "Namibia"
            },
            {
                "id": 155,
                "name": "Nauru"
            },
            {
                "id": 156,
                "name": "Nepal"
            },
            {
                "id": 157,
                "name": "Netherlands"
            },
            {
                "id": 158,
                "name": "New Caledonia"
            },
            {
                "id": 159,
                "name": "New Zealand"
            },
            {
                "id": 160,
                "name": "Nicaragua"
            },
            {
                "id": 161,
                "name": "Niger"
            },
            {
                "id": 162,
                "name": "Nigeria"
            },
            {
                "id": 163,
                "name": "Niue"
            },
            {
                "id": 164,
                "name": "Norfolk Island"
            },
            {
                "id": 165,
                "name": "Northern Mariana Islands"
            },
            {
                "id": 166,
                "name": "Norway"
            },
            {
                "id": 167,
                "name": "Oman"
            },
            {
                "id": 168,
                "name": "Pakistan"
            },
            {
                "id": 169,
                "name": "Palau"
            },
            {
                "id": 170,
                "name": "Palestine, State Of"
            },
            {
                "id": 171,
                "name": "Panama"
            },
            {
                "id": 172,
                "name": "Papua New Guinea"
            },
            {
                "id": 173,
                "name": "Paraguay"
            },
            {
                "id": 174,
                "name": "Peru"
            },
            {
                "id": 175,
                "name": "Philippines"
            },
            {
                "id": 176,
                "name": "Pitcairn"
            },
            {
                "id": 177,
                "name": "Poland"
            },
            {
                "id": 178,
                "name": "Portugal"
            },
            {
                "id": 179,
                "name": "Puerto Rico"
            },
            {
                "id": 180,
                "name": "Qatar"
            },
            {
                "id": 181,
                "name": "Reunion"
            },
            {
                "id": 182,
                "name": "Romania"
            },
            {
                "id": 183,
                "name": "Russian Federation"
            },
            {
                "id": 184,
                "name": "Rwanda"
            },
            {
                "id": 185,
                "name": "Saint Barthelemy"
            },
            {
                "id": 186,
                "name": "Saint Helena, Ascension and Tristan Da Cunha"
            },
            {
                "id": 187,
                "name": "Saint Kitts and Nevis"
            },
            {
                "id": 188,
                "name": "Saint Lucia"
            },
            {
                "id": 189,
                "name": "Saint Martin (FRENCH Part)"
            },
            {
                "id": 190,
                "name": "Saint Pierre and Miquelon"
            },
            {
                "id": 191,
                "name": "Saint Vincent and The Grenadines"
            },
            {
                "id": 192,
                "name": "Samoa"
            },
            {
                "id": 193,
                "name": "San Marino"
            },
            {
                "id": 194,
                "name": "Sao Tome and Principe"
            },
            {
                "id": 195,
                "name": "Saudi Arabia"
            },
            {
                "id": 196,
                "name": "Senegal"
            },
            {
                "id": 197,
                "name": "Serbia"
            },
            {
                "id": 198,
                "name": "Seychelles"
            },
            {
                "id": 199,
                "name": "Sierra Leone"
            },
            {
                "id": 200,
                "name": "Singapore"
            },
            {
                "id": 201,
                "name": "Sint Maarten (DUTCH Part)"
            },
            {
                "id": 202,
                "name": "Slovakia"
            },
            {
                "id": 203,
                "name": "Slovenia"
            },
            {
                "id": 204,
                "name": "Solomon Islands"
            },
            {
                "id": 205,
                "name": "Somalia"
            },
            {
                "id": 206,
                "name": "South Africa"
            },
            {
                "id": 207,
                "name": "South Georgia and The South Sandwich Islands"
            },
            {
                "id": 208,
                "name": "South Sudan"
            },
            {
                "id": 209,
                "name": "Spain"
            },
            {
                "id": 210,
                "name": "Sri Lanka"
            },
            {
                "id": 211,
                "name": "Sudan"
            },
            {
                "id": 212,
                "name": "Suriname"
            },
            {
                "id": 213,
                "name": "Svalbard and Jan Mayen"
            },
            {
                "id": 214,
                "name": "Swaziland"
            },
            {
                "id": 215,
                "name": "Sweden"
            },
            {
                "id": 216,
                "name": "Switzerland"
            },
            {
                "id": 217,
                "name": "Syrian Arab Republic"
            },
            {
                "id": 218,
                "name": "Taiwan, Province Of China"
            },
            {
                "id": 219,
                "name": "Tajikistan"
            },
            {
                "id": 220,
                "name": "Tanzania, United Republic Of"
            },
            {
                "id": 221,
                "name": "Thailand"
            },
            {
                "id": 222,
                "name": "Timor-Leste"
            },
            {
                "id": 223,
                "name": "Togo"
            },
            {
                "id": 224,
                "name": "Tokelau"
            },
            {
                "id": 225,
                "name": "Tonga"
            },
            {
                "id": 226,
                "name": "Trinidad and Tobago"
            },
            {
                "id": 227,
                "name": "Tunisia"
            },
            {
                "id": 228,
                "name": "Turkey"
            },
            {
                "id": 229,
                "name": "Turkmenistan"
            },
            {
                "id": 230,
                "name": "Turks and Caicos Islands"
            },
            {
                "id": 231,
                "name": "Tuvalu"
            },
            {
                "id": 232,
                "name": "Uganda"
            },
            {
                "id": 233,
                "name": "Ukraine"
            },
            {
                "id": 234,
                "name": "United Arab Emirates"
            },
            {
                "id": 235,
                "name": "United Kingdom"
            },
            {
                "id": 236,
                "name": "United States"
            },
            {
                "id": 237,
                "name": "United States Minor Outlying Islands"
            },
            {
                "id": 238,
                "name": "Uruguay"
            },
            {
                "id": 239,
                "name": "Uzbekistan"
            },
            {
                "id": 240,
                "name": "Vanuatu"
            },
            {
                "id": 241,
                "name": "Venezuela, Bolivarian Republic Of"
            },
            {
                "id": 242,
                "name": "Viet Nam"
            },
            {
                "id": 243,
                "name": "Virgin Islands, British"
            },
            {
                "id": 244,
                "name": "Virgin Islands, U.S."
            },
            {
                "id": 245,
                "name": "Wallis and Futuna"
            },
            {
                "id": 246,
                "name": "Western Sahara"
            },
            {
                "id": 247,
                "name": "Yemen"
            },
            {
                "id": 248,
                "name": "Zambia"
            },
            {
                "id": 249,
                "name": "Zimbabwe"
            }
        ],
        "time_zones": [
            {
                "value": "American Samoa",
                "code": "-11:00"
            },
            {
                "value": "International Date Line West",
                "code": "-11:00"
            },
            {
                "value": "Midway Island",
                "code": "-11:00"
            },
            {
                "value": "Hawaii",
                "code": "-10:00"
            },
            {
                "value": "Alaska",
                "code": "-09:00"
            },
            {
                "value": "Pacific Time (US & Canada)",
                "code": "-08:00"
            },
            {
                "value": "Tijuana",
                "code": "-08:00"
            },
            {
                "value": "Arizona",
                "code": "-07:00"
            },
            {
                "value": "Chihuahua",
                "code": "-07:00"
            },
            {
                "value": "Mazatlan",
                "code": "-07:00"
            },
            {
                "value": "Mountain Time (US & Canada)",
                "code": "-07:00"
            },
            {
                "value": "Central America",
                "code": "-06:00"
            },
            {
                "value": "Central Time (US & Canada)",
                "code": "-06:00"
            },
            {
                "value": "Guadalajara",
                "code": "-06:00"
            },
            {
                "value": "Mexico City",
                "code": "-06:00"
            },
            {
                "value": "Monterrey",
                "code": "-06:00"
            },
            {
                "value": "Saskatchewan",
                "code": "-06:00"
            },
            {
                "value": "Bogota",
                "code": "-05:00"
            },
            {
                "value": "Eastern Time (US & Canada)",
                "code": "-05:00"
            },
            {
                "value": "Indiana (East)",
                "code": "-05:00"
            },
            {
                "value": "Lima",
                "code": "-05:00"
            },
            {
                "value": "Quito",
                "code": "-05:00"
            },
            {
                "value": "Caracas",
                "code": "-04:30"
            },
            {
                "value": "Atlantic Time (Canada)",
                "code": "-04:00"
            },
            {
                "value": "Georgetown",
                "code": "-04:00"
            },
            {
                "value": "La Paz",
                "code": "-04:00"
            },
            {
                "value": "Santiago",
                "code": "-04:00"
            },
            {
                "value": "Newfoundland",
                "code": "-03:30"
            },
            {
                "value": "Brasilia",
                "code": "-03:00"
            },
            {
                "value": "Buenos Aires",
                "code": "-03:00"
            },
            {
                "value": "Greenland",
                "code": "-03:00"
            },
            {
                "value": "Mid-Atlantic",
                "code": "-02:00"
            },
            {
                "value": "Azores",
                "code": "-01:00"
            },
            {
                "value": "Cape Verde Is.",
                "code": "-01:00"
            },
            {
                "value": "Casablanca",
                "code": "+00:00"
            },
            {
                "value": "Dublin",
                "code": "+00:00"
            },
            {
                "value": "Edinburgh",
                "code": "+00:00"
            },
            {
                "value": "Lisbon",
                "code": "+00:00"
            },
            {
                "value": "London",
                "code": "+00:00"
            },
            {
                "value": "Monrovia",
                "code": "+00:00"
            },
            {
                "value": "UTC",
                "code": "+00:00"
            },
            {
                "value": "Amsterdam",
                "code": "+01:00"
            },
            {
                "value": "Belgrade",
                "code": "+01:00"
            },
            {
                "value": "Berlin",
                "code": "+01:00"
            },
            {
                "value": "Bern",
                "code": "+01:00"
            },
            {
                "value": "Bratislava",
                "code": "+01:00"
            },
            {
                "value": "Brussels",
                "code": "+01:00"
            },
            {
                "value": "Budapest",
                "code": "+01:00"
            },
            {
                "value": "Copenhagen",
                "code": "+01:00"
            },
            {
                "value": "Ljubljana",
                "code": "+01:00"
            },
            {
                "value": "Madrid",
                "code": "+01:00"
            },
            {
                "value": "Paris",
                "code": "+01:00"
            },
            {
                "value": "Prague",
                "code": "+01:00"
            },
            {
                "value": "Rome",
                "code": "+01:00"
            },
            {
                "value": "Sarajevo",
                "code": "+01:00"
            },
            {
                "value": "Skopje",
                "code": "+01:00"
            },
            {
                "value": "Stockholm",
                "code": "+01:00"
            },
            {
                "value": "Vienna",
                "code": "+01:00"
            },
            {
                "value": "Warsaw",
                "code": "+01:00"
            },
            {
                "value": "West Central Africa",
                "code": "+01:00"
            },
            {
                "value": "Zagreb",
                "code": "+01:00"
            },
            {
                "value": "Athens",
                "code": "+02:00"
            },
            {
                "value": "Bucharest",
                "code": "+02:00"
            },
            {
                "value": "Cairo",
                "code": "+02:00"
            },
            {
                "value": "Harare",
                "code": "+02:00"
            },
            {
                "value": "Helsinki",
                "code": "+02:00"
            },
            {
                "value": "Istanbul",
                "code": "+02:00"
            },
            {
                "value": "Jerusalem",
                "code": "+02:00"
            },
            {
                "value": "Kyiv",
                "code": "+02:00"
            },
            {
                "value": "Pretoria",
                "code": "+02:00"
            },
            {
                "value": "Riga",
                "code": "+02:00"
            },
            {
                "value": "Sofia",
                "code": "+02:00"
            },
            {
                "value": "Tallinn",
                "code": "+02:00"
            },
            {
                "value": "Vilnius",
                "code": "+02:00"
            },
            {
                "value": "Baghdad",
                "code": "+03:00"
            },
            {
                "value": "Kuwait",
                "code": "+03:00"
            },
            {
                "value": "Minsk",
                "code": "+03:00"
            },
            {
                "value": "Nairobi",
                "code": "+03:00"
            },
            {
                "value": "Riyadh",
                "code": "+03:00"
            },
            {
                "value": "Tehran",
                "code": "+03:30"
            },
            {
                "value": "Abu Dhabi",
                "code": "+04:00"
            },
            {
                "value": "Baku",
                "code": "+04:00"
            },
            {
                "value": "Moscow",
                "code": "+04:00"
            },
            {
                "value": "Muscat",
                "code": "+04:00"
            },
            {
                "value": "St. Petersburg",
                "code": "+04:00"
            },
            {
                "value": "Tbilisi",
                "code": "+04:00"
            },
            {
                "value": "Volgograd",
                "code": "+04:00"
            },
            {
                "value": "Yerevan",
                "code": "+04:00"
            },
            {
                "value": "Kabul",
                "code": "+04:30"
            },
            {
                "value": "Islamabad",
                "code": "+05:00"
            },
            {
                "value": "Karachi",
                "code": "+05:00"
            },
            {
                "value": "Tashkent",
                "code": "+05:00"
            },
            {
                "value": "Chennai",
                "code": "+05:30"
            },
            {
                "value": "Kolkata",
                "code": "+05:30"
            },
            {
                "value": "Mumbai",
                "code": "+05:30"
            },
            {
                "value": "New Delhi",
                "code": "+05:30"
            },
            {
                "value": "Sri Jayawardenepura",
                "code": "+05:30"
            },
            {
                "value": "Kathmandu",
                "code": "+05:45"
            },
            {
                "value": "Almaty",
                "code": "+06:00"
            },
            {
                "value": "Astana",
                "code": "+06:00"
            },
            {
                "value": "Dhaka",
                "code": "+06:00"
            },
            {
                "value": "Ekaterinburg",
                "code": "+06:00"
            },
            {
                "value": "Rangoon",
                "code": "+06:30"
            },
            {
                "value": "Bangkok",
                "code": "+07:00"
            },
            {
                "value": "Hanoi",
                "code": "+07:00"
            },
            {
                "value": "Jakarta",
                "code": "+07:00"
            },
            {
                "value": "Novosibirsk",
                "code": "+07:00"
            },
            {
                "value": "Beijing",
                "code": "+08:00"
            },
            {
                "value": "Chongqing",
                "code": "+08:00"
            },
            {
                "value": "Hong Kong",
                "code": "+08:00"
            },
            {
                "value": "Krasnoyarsk",
                "code": "+08:00"
            },
            {
                "value": "Kuala Lumpur",
                "code": "+08:00"
            },
            {
                "value": "Perth",
                "code": "+08:00"
            },
            {
                "value": "Singapore",
                "code": "+08:00"
            },
            {
                "value": "Taipei",
                "code": "+08:00"
            },
            {
                "value": "Ulaan Bataar",
                "code": "+08:00"
            },
            {
                "value": "Urumqi",
                "code": "+08:00"
            },
            {
                "value": "Irkutsk",
                "code": "+09:00"
            },
            {
                "value": "Osaka",
                "code": "+09:00"
            },
            {
                "value": "Sapporo",
                "code": "+09:00"
            },
            {
                "value": "Seoul",
                "code": "+09:00"
            },
            {
                "value": "Tokyo",
                "code": "+09:00"
            },
            {
                "value": "Adelaide",
                "code": "+09:30"
            },
            {
                "value": "Darwin",
                "code": "+09:30"
            },
            {
                "value": "Brisbane",
                "code": "+10:00"
            },
            {
                "value": "Canberra",
                "code": "+10:00"
            },
            {
                "value": "Guam",
                "code": "+10:00"
            },
            {
                "value": "Hobart",
                "code": "+10:00"
            },
            {
                "value": "Melbourne",
                "code": "+10:00"
            },
            {
                "value": "Port Moresby",
                "code": "+10:00"
            },
            {
                "value": "Sydney",
                "code": "+10:00"
            },
            {
                "value": "Yakutsk",
                "code": "+10:00"
            },
            {
                "value": "New Caledonia",
                "code": "+11:00"
            },
            {
                "value": "Vladivostok",
                "code": "+11:00"
            },
            {
                "value": "Auckland",
                "code": "+12:00"
            },
            {
                "value": "Fiji",
                "code": "+12:00"
            },
            {
                "value": "Kamchatka",
                "code": "+12:00"
            },
            {
                "value": "Magadan",
                "code": "+12:00"
            },
            {
                "value": "Marshall Is.",
                "code": "+12:00"
            },
            {
                "value": "Solomon Is.",
                "code": "+12:00"
            },
            {
                "value": "Wellington",
                "code": "+12:00"
            },
            {
                "value": "Nuku'alofa",
                "code": "+13:00"
            },
            {
                "value": "Samoa",
                "code": "+13:00"
            },
            {
                "value": "Tokelau Is.",
                "code": "+13:00"
            }
        ],
        "hotel_time_zone": "Eastern Time (US & Canada)",
        "currency_list": [
            {
                "id": 1,
                "code": "USD"
            }
        ],
        "pms_types": [
            {
                "value": "OWS",
                "description": "Opera Web Service"
            }
        ],
        "hotel_pms_type": "OWS",
        "is_pms_tokenized": "false",
        "hotel_name": "Carlyle Suites Hotel",
        "domain_name": null,
        "hotel_code": "DOZERQA",
        "hotel_brand": 17,
        "hotel_chain": 1,
        "street": "2113 Dupont Circle Park",
        "city": "democity",
        "state": "demostate",
        "zipcode": "20004",
        "country": 236,
        "phone": "1241241231",
        "number_of_rooms": 130,
        "default_currency": 1,
        "contact_first_name": "Hotel",
        "contact_last_name": "Contact",
        "contact_email": "Hotel@test1.com",
        "contact_phone": "21223123",
        "required_signature_at": "CHECKIN",
        "check_in_time": {
            "hour": "06",
            "minute": "00",
            "primetime": "AM"
        },
        "check_out_time": {
            "hour": "01",
            "minute": "00",
            "primetime": "PM"
        },
        "latitude": 38.8951,
        "longitude": -77.0226,
        "is_res_import_on": true,
        "auto_logout_delay": 60,
        "mli_hotel_code": "DOZERQA",
        "mli_chain_code": "CHA",
        "hotel_from_address": "reservations@dozerqa.stayntouch.com",
        "mli_pem_certificate_loaded": true,
        "hotel_logo": "http://9febeb11de6bb5e0ee62-821329d308ba0768463def967ad6e6e5.r41.cf2.rackcdn.com/CHA/DOZERQA/hotels/1/icons/original/logo20140319181839.png",
        "mli_access_url": "https://tv1var.merchantlink.com:8184"
    	};
    	return _this.data;
	}
		


}]);