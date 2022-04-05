### tg-file-id 
A simple nodejs module to decode file\_id and file\_uniq\_id of telegram bots 
### install 
```bash 
npm install tg-file-id --save
```
### FileId parameters 
`version` : Number of bot api file_id version. Usually `4`   
`subVersion` : Number of bot api file_id subVersion. Usually `30`.  
`dcId` : The data center where the file is stored.  
`typeId` : File type (number).You can see the list of file type in [here](#filetype).  
`fileType` : File type (string).You can see the list of file type in [here](#filetype).  
`fileReference` : [Telegram file reference.](https://core.telegram.org/api/file_reference)    
`url` : Url web locations.  
`id` : The id of file.  
`accessHash` : The accessHash of file.  
`volumeId` : Volume id of file. If you didn't know the volumeId of your file. You can fill it with `BigInt(1)`.  
`localId` : Local id of file. If you didn't know the localId of your file. You can fill it with `0`.  
`photoSizeSource` : Specific photo type (string), the type is same with phototype. You can see list of photoSizeSource in [here](#phototype).  
`photoSizeSourceId` : Specific photo type (number), the number is same with phototype. You can see list of photoSizeSource in [here](#phototype).  
`secret` : Secret id.  
`dialogId` : Chat id. Using to create a file id from photo profile.  
`dialogAccessHash` : Chat accessHash. Using to create a file id from photo profile.  
`isSmallDialogPhoto` : Do you want to make a small photo profile.  
`stickerSetId` : Id of sticker set.  
`stickerSetAccessHash` : Access hash of sticker set.  
`thumbType` : Thumbnail type (string), the type is same with phototype. You can see list of thumbnail type in [here](#phototype).  
`thumbTypeId` : Thumbnail type (number), the number is same with phototype. You can see list of thumbnail type in [here](#phototype).  

### fileType 
`thumbnail` : `0`  
`profile_photo` : `1`  
`photo` : `2`  
`voice` : `3`  
`video` : `4`  
`document` : `5`  
`encrypted` : `6`  
`temp` : `7`  
`sticker` : `8`  
`audio` : `9`  
`animation` : `10`  
`encrypted_thumbnail` : `11`  
`wallpaper` : `12`  
`video_note` : `13`  
`secure_raw` : `14`  
`secure` : `15`  
`background` : `16`  
`size` : `17`  
### photoType 
`LEGACY` : `0`  
`THUMBNAIL` : `1`  
`DIALOGPHOTO_SMALL` : `2`  
`DIALOGPHOTO_BIG` : `3`  
`STICKERSET_THUMBNAIL` : `4`  
