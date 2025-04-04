import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';

interface PeopleInfoComProps {
  onPeopleInfoChange: (updatedInfo: { [key: string]: string }) => void;
}

const PeopleInfoCom: React.FC<PeopleInfoComProps> = ({ onPeopleInfoChange }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedFields, setSelectedFields] = useState<Map<string, string>>(
    new Map() // Using Map to store selected field and its dynamic value
  );

  const peopleOptions: string[] = [
    "Name", "Age", "NID/Passport", "Mobile Number", "Division", "District", "Thana"
  ];

  const handleSelectField = (option: string) => {
    if (!selectedFields.has(option)) {
      setSelectedFields(new Map(selectedFields.set(option, "")));
    }
    setIsModalVisible(false);
  };

  const handleInputChange = (field: string, value: string) => {
    const updatedFields = new Map(selectedFields.set(field, value));
    setSelectedFields(updatedFields);

    // Notify parent with the updated info
    const updatedInfo = Object.fromEntries(updatedFields);
    onPeopleInfoChange(updatedInfo);
  };

  const handleRemoveField = (field: string) => {
    const updatedFields = new Map(selectedFields);
    updatedFields.delete(field);
    setSelectedFields(updatedFields);

    // Notify parent of the updated info
    const updatedInfo = Object.fromEntries(updatedFields);
    onPeopleInfoChange(updatedInfo);
  };
 
  return (
    <View className="flex-1 justify-center items-center bg-purple-500 p-4">
      {/* Modal Trigger Button */}
      <TouchableOpacity 
        className="w-full bg-white p-4 mb-6 rounded-md" 
        onPress={() => setIsModalVisible(true)}
      >
        <Text className="text-black w-full text-xl font-bold text-center">People Information ▼</Text>
      </TouchableOpacity>

      {/* Modal for Selecting Fields */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-[90%] bg-white p-4 rounded-md">
            <Text className="text-xl font-bold text-center mb-4">Select Information</Text>

            {peopleOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                className="p-2 border-b border-gray-300"
                onPress={() => handleSelectField(option)}
              >
                <Text className="text-lg">{option}</Text>
              </TouchableOpacity>
            ))}

            {/* Close Modal Button */}
            <TouchableOpacity
              className="mt-4 bg-red-500 p-3 rounded-md"
              onPress={() => setIsModalVisible(false)}
            >
              <Text className="text-white text-center font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Display Selected Fields with Input */}
      <View className="w-full bg-white p-4 mt-4 rounded-md">
        {selectedFields.size === 0 ? (
          <Text className="text-center text-gray-500">No fields selected</Text>
        ) : (
          Array.from(selectedFields.entries()).map(([field, value], index) => (
            <View key={index} className="mb-4">
              <Text className="text-lg font-bold mb-2">{field}</Text>
              <TextInput
                value={value}
                placeholder={`Enter ${field}`}
                onChangeText={(text) => handleInputChange(field, text)}
                keyboardType={
                  field === "Age" ? "numeric"
                  : field === "Mobile Number" ? "phone-pad"
                  : "default"
                }
                className="w-full p-3 bg-white border-2 border-gray-300 rounded-md"
              />
              {/* Remove Field Button */}
              <TouchableOpacity
                className="mt-2 bg-red-500 p-2 rounded-md"
                onPress={() => handleRemoveField(field)}
              >
                <Text className="text-white text-center font-bold">Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

export default PeopleInfoCom;
