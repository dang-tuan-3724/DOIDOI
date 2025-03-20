import { View, Text, Modal as RNModal, ModalProps, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'


type PROPS=ModalProps & {
    isOpen: boolean
    withInput?: boolean
}
export const Modal = ({isOpen, withInput, children, ...rest}:PROPS) => {
    const content = withInput ?(
        <KeyboardAvoidingView
        className='items-center justify-center flex-1 px-3 bg-zinc-900/40 '
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
             {children}
        </KeyboardAvoidingView>
      )  : (
           <View className='items-center justify-center flex-1 mr-5 ml-5 ' >
                {children}
           </View>
      )
    
  return (
    <RNModal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      statusBarTranslucent
      {...rest}
    >
        {content}
    </RNModal>
  )
}

