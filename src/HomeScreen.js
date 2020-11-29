import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, RefreshControl } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/AntDesign'
import database from '@react-native-firebase/database';

export default function HomeScreen(props) {

    const [isLoading, setLoading] = useState(false)
    const [listData, setListData] = useState([]);

    useEffect(() => {
        fetchFeed();
    }, [])

    const fetchFeed = async () => {
        const res = await database().ref("/feed/").once("value")
        // {key:[], key:[], key:[]}
        var tempData = []
        Object.keys(res.val()).sort((a, b) => { return (b - a) }).forEach(keys => {
            tempData = [
                ...tempData,
                res.val()[keys]
            ]
        })
        setListData(tempData)
    }

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <FlatList
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={async () => {
                        setLoading(true)
                        await fetchFeed()
                        setLoading(false)
                    }} />
                }
                data={listData}
                renderItem={({ item }) => <View style={{
                    margin: 10, borderRadius: 7, elevation: 5, backgroundColor: "white", shadowColor: '#333',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.5,
                    shadowRadius: 2,
                }}>


                    <View style={{ flexDirection: "row", alignItems: "center", padding: 10, }}>
                        <Image source={{ uri: "https://organicthemes.com/demo/profile/files/2018/05/profile-pic.jpg" }} style={{ height: 50, width: 50, borderRadius: 50 }} />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={{ fontSize: 20 }}>{item.name}</Text>
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ fontSize: 12 }}>{new Date(item.createdOn).toString().substring(0, 16)}</Text>
                                <Text style={{ fontSize: 12, marginLeft: 5 }}>{new Date(item.createdOn).getHours() + " : " + new Date(item.createdOn).getMinutes()}</Text>
                            </View>
                        </View>
                    </View>
                    {
                        item.isImage ? <Image source={{ uri: "https://firebasestorage.googleapis.com/v0/b/socialapp-2ff3f.appspot.com/o/feed%2F" + item.createdOn + ".png?alt=media&token=d47835f7-a84b-49ed-af9c-46889c0651a9" }} style={{ height: 200 }} />
                            : null
                    }

                    <Text style={{ margin: 10, color: "#333", fontSize: 12, marginTop: 5 }}>{item.text}</Text>

                    <View style={{ height: 1, width: "100%", backgroundColor: "#3333" }} />

                    <View style={{ flexDirection: "row", }}>
                        <TouchableOpacity style={{ flex: 1, margin: 10 }}>
                            <Text style={{ textAlign: "center", fontWeight: "bold" }}>Like</Text>
                        </TouchableOpacity>

                        <View style={{ backgroundColor: "#3333", height: "100%", width: 1 }} />

                        <TouchableOpacity style={{ flex: 1, margin: 10 }}>
                            <Text style={{ textAlign: "center", fontWeight: "bold" }}>Comment</Text>
                        </TouchableOpacity>
                    </View>


                </View>}
                keyExtractor={(item) => (item.createdOn + "")}
            />

            <TouchableOpacity
                onPress={() => {
                    props.navigation.navigate("Create Feed")
                }}
                style={{ position: "absolute", right: 60, bottom: 60, backgroundColor: "#f66", borderRadius: 30, }}>
                <MaterialIcon name="plus" color="white" size={15} style={{ margin: 20 }} />
            </TouchableOpacity>
        </View>
    )
}