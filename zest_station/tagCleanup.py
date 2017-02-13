#import glob
import os
import io
#import sys
import datetime

stationDirectory = '/app/assets/zest_station'
#passedDirectory = str(sys.argv[1])
passedDirectory = 'partials_v2/'

currentDirectory = os.getcwd()
print(currentDirectory)

MissingTagsFound = []
JSONMasterList = []
TagsFoundInDirectory = []
unusedTags = []

if passedDirectory is '.':
    passedDirectory = str(os.path.abspath('.'))
print('improved path: '+passedDirectory)


def find_between(s, first, last):

    try:
        start = s.index(first) + len(first)
        end = s.index(last, start)
        return s[start:end]
    except ValueError:
        return ""


stringsToRemove = ['translate', '|', ' ', '"', '"', "'", "'" ',', '.']


def cleanTag(tag):

    try:
        for stringVal in stringsToRemove:
            tag = tag.replace(stringVal, '')

        if tag.isupper():
            return tag

        return ''
    except ValueError:
        return ''


def findMissingTags():
    print('')
    print(':: findMissingTags ::')
    print('')
    #currentDirectory is app/assets/zest_station
    masterFilePath = 'zsLocales/EN_snt.json'
    masterFile = open(currentDirectory+'/'+masterFilePath)

    line = masterFile.readline()

    while line:
        registeredTag = find_between(line, '"', '":')
        if len(registeredTag) > 0:
            if registeredTag not in JSONMasterList:
                #print('json tag [ '+registeredTag+' ]')
                JSONMasterList.append(registeredTag)

        line = masterFile.readline()

    masterFile.close()


def compileMissingTagList():
    print('')
    print(':: compileMissingTagList ::')
    print('')
    for tag in TagsFoundInDirectory:

        if tag not in JSONMasterList:
            if tag not in MissingTagsFound:
                MissingTagsFound.append(tag)


#show current working directory
print('============================')
print('==========Lets Rock=========')
print('============================')
fullPathHere = os.chdir(currentDirectory)

#track tags found with an array list


def getPath(p):
    longPath = ''
    for d in p:
        longPath += d + '/'
    return longPath

##begin traverse files
#
#Tags found in HTML
for root, dirs, files in os.walk(passedDirectory):
    path = root.split(os.sep)
    validPath = str(getPath(path))

    for file in files:
        #print(currentDirectory,' >>>> ', file)

        if file.endswith('.html'):

            pathToFile = str(currentDirectory)+'/'+validPath+file
            print('pathToFile: :: '+pathToFile)
            pathToFile.replace('//', '/')
#print(currentFile)
# Open the currentFile with read only permit
            f = open(pathToFile)
## Read the first line
            file_line = f.readline()

## If the currentFile is not empty keep reading line one at a time
## till the currentFile is empty
            tagCount = 0
            while file_line:
#print file_line
                foundTag = find_between(file_line, "{{", "translate")
                foundTag = cleanTag(foundTag)
                if len(foundTag) > 0:
                    if foundTag not in TagsFoundInDirectory:
                        tagCount = tagCount+1
                        TagsFoundInDirectory.append(foundTag)
                #read next line
                file_line = f.readline()
                 #matchedCase
            #print('has ['+str(tagCount)+'] new tags')
            f.close()


def compileListOfUnusedTags():
    for tagg in JSONMasterList:
        if tagg not in TagsFoundInDirectory:
            unusedTags.append(tagg)


##done with files

findMissingTags()

compileMissingTagList()

compileListOfUnusedTags()

#count the number of tags in the tag array
numTagsFound = str(len(TagsFoundInDirectory))
numTagsMissing = str(len(MissingTagsFound))

TagsFoundInDirectory = str(TagsFoundInDirectory)
MissingTagsFound = str(MissingTagsFound)

totalTagsFound = str(numTagsFound)
totalMissingTags = str(numTagsMissing)

totalUnusedTags = str(len(unusedTags))

unusedTags = str(unusedTags)
#print results
print("[ " + totalTagsFound + " Tags Found ], [ " + totalMissingTags + " Tags MISSING ** ]")


foundInHtmlHeader = ' - - - - - - FOUND IN HTML ('+totalTagsFound+') - - - - - - - '
spacer = '' + '\n'
lineSpacer = '\n'+' - - - - - - - - - - - - - - - ' + '\n'

missingTagsHeader = ' - - - - - - MISSING FROM JSON (' + totalMissingTags + ') - - - - - - - '
notUsedInJsonHeader = ' - - - - - - NOT USED, BUT IN JSON (' + totalUnusedTags + ') - - - - - - - '

print(foundInHtmlHeader)
print(spacer)
print(TagsFoundInDirectory)
print(lineSpacer)

#print results
print(spacer)
print(spacer)

print(missingTagsHeader)
print(spacer)
print(MissingTagsFound)
print(spacer)
print(lineSpacer)


print(notUsedInJsonHeader)
print(spacer)
print(unusedTags)
print(spacer)
print(lineSpacer)

with io.FileIO("cleanLocaleLog.txt", "w") as tracker_file:

    tracker_file.write(spacer)
    tracker_file.write(lineSpacer)
    tracker_file.write(datetime.datetime.now().strftime("%A, %d. %B %Y %I:%M%p"))
    tracker_file.write(lineSpacer)
    tracker_file.write(spacer)

    tracker_file.write(foundInHtmlHeader)
    tracker_file.write(spacer)
    tracker_file.write(TagsFoundInDirectory)
    tracker_file.write(lineSpacer)

    #print results
    tracker_file.write(spacer)
    tracker_file.write(spacer)

    tracker_file.write(missingTagsHeader)
    tracker_file.write(spacer)
    tracker_file.write(MissingTagsFound)
    tracker_file.write(spacer)
    tracker_file.write(lineSpacer)

    tracker_file.write(notUsedInJsonHeader)
    tracker_file.write(spacer)
    tracker_file.write(unusedTags)
    tracker_file.write(spacer)
    tracker_file.write(lineSpacer)
