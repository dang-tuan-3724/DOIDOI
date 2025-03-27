import { View, Text } from 'react-native'
import React from 'react'

const logItem = () => {
  return (
    <View style={{
        backgroundColor: '#C4FFB8',
        padding: 20,
        paddingBottom: 30,
        paddingTop: 30,
        margin: 10,
        borderRadius: 50,
        flexDirection: 'row',
        justifyContent: 'space-between'


    }}>
    <Text>11/11/2024</Text>
    <Text>Tẳt máy bơm</Text>
    <Text>Người dùng</Text>
    </View>
  )
}

export default logItem