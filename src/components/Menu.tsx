import { MaterialIcons } from "@expo/vector-icons"
import { useState } from "react"
import { Text, Modal, TouchableOpacity, View, Alert } from "react-native"
import Animated, { SlideInDown, FadeInUp, FadeOutUp } from "react-native-reanimated";

interface MenuProps {
    onEdit: () => void
    onDelete: () => void
}

export function Menu({ onEdit, onDelete }: MenuProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    function handleEdit() {
        setIsMenuOpen(false)
        onEdit()
    }

    function handleDelete() {
        setIsMenuOpen(false)
        onDelete()
    }

    return (
        <View>
            <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)}>
                <MaterialIcons name="more-vert" size={24} color="white" />
            </TouchableOpacity>
            {isMenuOpen && (
                <Animated.View className="absolute right-9 w-40 bg-white rounded-sm" entering={FadeInUp.duration(500)} exiting={FadeOutUp}>
                    <TouchableOpacity onPress={handleEdit} className="block px-4 py-2.5">
                        <Text className="text-gray-700 text-sm font-semiBold text-center">Editar</Text>
                    </TouchableOpacity>
                    <View className="border-t border-gray-200" />
                    <TouchableOpacity onPress={handleDelete} className="block px-4 py-2.5">
                        <Text className="text-gray-700 text-sm font-semiBold text-center ">Excluir</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    )
}
