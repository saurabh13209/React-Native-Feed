import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ImageBackground, ActivityIndicator, Platform, ToastAndroid, Alert } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import ImagePicker from 'react-native-image-picker';
import storage from '@react-native-firebase/storage'; // user to uplaod Image
import database from '@react-native-firebase/database' //  upload data -> text data
import RNFetchBlob from 'rn-fetch-blob';

const fetchData = async (uri) => {
    if (Platform.OS === "ios") return uri
    const stat = await RNFetchBlob.fs.stat(uri)
    return stat.path
}

export default function CreateFeed(props) {

    const [textValue, setValue] = useState("")
    const [image, setImage] = useState("");
    const [isLoading, setLoading] = useState(false)

    return (
        <View style={{ backgroundColor: "white", flex: 1 }}>
            {isLoading ? <ActivityIndicator size="large" color="#f66" style={{ position: "absolute", top: "45%", left: "45%" }} /> : null}
            {image == "" ? <TouchableOpacity
                onPress={() => {
                    ImagePicker.launchImageLibrary({}, (response) => {
                        if (!response.didCancel) {
                            setImage(response.uri)
                        }
                    });
                }}
                style={{ backgroundColor: "#aaa3", justifyContent: "center", alignItems: "center", height: 200 }}>
                <AntIcon name="pluscircleo" color="white" size={80} />
                <Text style={{ fontSize: 20, marginTop: 5, color: "white" }}>Add Image</Text>
            </TouchableOpacity> : <ImageBackground source={{ uri: image }} style={{ height: 200, alignItems: "flex-end" }}>
                    <TouchableOpacity
                        onPress={() => {
                            setImage("")
                        }}
                        style={{ padding: 10 }}>
                        <Entypo name="circle-with-cross" color="white" size={30} />
                    </TouchableOpacity>
                </ImageBackground>}
            <TextInput
                style={{ textAlignVertical: "top", padding: 10 }}
                placeholder={"Add Feed Text here!!"}
                numberOfLines={5}
                value={textValue}
                onChangeText={(res) => {
                    setValue(res)
                }}
            />

            <TouchableOpacity
                onPress={async () => {
                    if (textValue == "") {
                        if (Platform.OS == "android") {
                            ToastAndroid.show("Please enter text", ToastAndroid.LONG)
                        } else {
                            Alert.alert("Please enter text")
                        }
                    }

                    setLoading(true);

                    const dateTime = new Date();

                    const uploadObj = {
                        name: "RandomName",  // while login,
                        profileImage: "https://media.istockphoto.com/photos/blue-abstract-background-or-texture-picture-id1138395421?k=6&m=1138395421&s=612x612&w=0&h=bJ1SRWujCgg3QWzkGPgaRiArNYohPl7-Wc4p_Fa_cyA=",
                        text: textValue,
                        isImage: image == "" ? false : true,
                        createdOn: dateTime.getTime()
                    }

                    if (image == "") {
                        // upload no Image
                        await database().ref("feed/" + dateTime.getTime() + "/").set(uploadObj)
                    } else {
                        // upload Image 
                        // image name -> timestamp (unique Id)
                        const uploadImage = await storage().ref("feed/" + dateTime.getTime() + ".png").putFile(await fetchData(image))
                        console.log(uploadImage)
                        if (uploadImage.state == "success") {
                            await database().ref("feed/" + dateTime.getTime() + "/").set(uploadObj)
                        }
                    }

                    setLoading(false)
                    props.navigation.pop()

                }}
                style={{ backgroundColor: "#f66", margin: 10, borderRadius: 10, top: 300 }}>
                <Text style={{ color: "white", margin: 15, fontSize: 20, textAlign: "center" }}>Post</Text>
            </TouchableOpacity>
        </View>
    )
}