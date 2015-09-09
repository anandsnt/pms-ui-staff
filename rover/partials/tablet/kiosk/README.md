HTML, icons and style assets for Kiosk app. Includes sample Zoku theme
Live sample - http://stayntouch.perceptiveinteractive.com/kiosk/

## HTML templates
#### Generic
1. General - generic/general.html
2. General (Aligned Left) - generic/general-left.html
3. Modal - generic/modal.html
4. Modal (Aligned Top) - generic/modal-top.html
5. Transition - generic/transition.html
6. Text Input - generic/input-text.html
7. Date Input - generic/input-date.html
8. 2 Option Nav - generic/nav-2-options.html
9. 3 Option Nav - generic/nav-3-options.html
10. Large Option Nav - generic/nav-large-options.html
11. Error - generic/error.html

#### Specific
1. Login - specific/login.html
2. Home - specific/home.html
3. CI, Find Reservation - specific/find-reservation.html
4. CI, Select Reservation - specific/select-reservation.html
5. CI, No Match - specific/no-match.html
6. CI, Reservation Details - specific/reservation-details.html
7. CI, Additional Guests - specific/additional-guests.html
8. CI, Collect CC (Swipe) - specific/swipe.html
9. CI, Collect CC (Sign) - specific/sign.html
10. CI, Collect CC (Signature Time out) - specific/signature-time-out.html
11. CI, Invalid Email - specific/invald-email.html
12. CI, Select No. of Keys - specific/select-keys.html
13. CI, Select No. of Keys after Check In - specific/select-keys-after-checkin.html
14. CI, Make Key - specific/make-key.html
15. CI, Early Available - specific/early-available.html
16. CI, Early Unavailable - specific/early-unavailable.html
17. CO, Review Bill - specific/review-bill.html
18. CO Completed - specific/checked-out.html
19. Out of Service - specific/oos.html

## LESS styles
App styles are located in assets/less folder. These are core app styles, and should not be modified.

## Icons
SVG icons are located in assets/icons folder. They should be included as inline SVG (copy their code into HTML code) where specified in templates with {../assets/icons/{icon}.svg}

## Client assets
#### Setup
For each client, create {hote-id}.less file and a {hotel-id} folder, in which the following assets should be placed:

1. Custom font files if they can't be included as base64 into the less template
2. Background image, in PNG or JPEG
3. Logo, in SVG format
4. theme.less - specific set to custom hotel styles.


#### Theme.less - used to set

##### Colors:
1. Text color
2. Background color
3. Background image
4. Button color
5. Button background
6. Transparent color (black or white, and a level of transparency)
7. Input background color
8. Header icons color
9. Header icons color (pressed state)

##### Typography:
1. @font-face rule
2. font-family

##### Background 
1. Image and size of it

##### Icons 
1. Fill and stroke color for each SVG icon, if needed

##### Layout
1. custom layout rules that override core app styles
