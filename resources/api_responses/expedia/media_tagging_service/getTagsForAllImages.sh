#!/bin/sh

username=EQC16637524hotel
password=test1234Test!

NUMIMG=13
for ((i=1;i<=NUMIMG;i++)); do
	foo=$(printf "%02d" $i)
    #curl -u $username:$password -F mediaUrl=http://35.158.79.41/ExpediaHackathon2017/resources/test_data/2280482/pics/2280482_$foo.jpg 'https://services.expediapartnercentral.com/image-tag/v2' -o ./2280482/2280482_$foo.json
done

NUMIMG=17
for ((i=1;i<=NUMIMG;i++)); do
	foo=$(printf "%02d" $i)
    curl -u $username:$password -F mediaUrl=http://35.158.79.41/ExpediaHackathon2017/resources/test_data/9917391/pics/9917391_$foo.jpg 'https://services.expediapartnercentral.com/image-tag/v2' -o ./9917391/9917391_$foo.json
done

NUMIMG=32
for ((i=1;i<=NUMIMG;i++)); do
	foo=$(printf "%02d" $i)
    curl -u $username:$password -F mediaUrl=http://35.158.79.41/ExpediaHackathon2017/resources/test_data/10275336/pics/10275336_$foo.jpg 'https://services.expediapartnercentral.com/image-tag/v2' -o ./10275336/10275336_$foo.json
done
