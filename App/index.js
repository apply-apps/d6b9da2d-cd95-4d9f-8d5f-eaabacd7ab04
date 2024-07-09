// Filename: index.js
// Combined code from all files

import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, ScrollView, View, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

export default function App() {
    const [heroes, setHeroes] = React.useState('');
    const [villains, setVillains] = React.useState('');
    const [plot, setPlot] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [story, setStory] = React.useState('');

    const generateStory = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://apihub.p.appply.xyz:3300/chatgpt', {
                messages: [
                    { role: "system", content: "You are a helpful assistant. Please create a fairy tale based on the given heroes, villains, and plot" },
                    { role: "user", content: `Heroes: ${heroes}, Villains: ${villains}, Plot: ${plot}` }
                ],
                model: "gpt-4o"
            });
            const { text: story } = response.data.response;
            setStory(story);
        } catch (error) {
            console.error(error);
            setStory("An error occurred while generating the story.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Fairy Tale Generator</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Heroes..."
                    value={heroes}
                    onChangeText={setHeroes}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Villains..."
                    value={villains}
                    onChangeText={setVillains}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Plot..."
                    value={plot}
                    onChangeText={setPlot}
                />
                <Button title="Generate Fairy Tale" onPress={generateStory} />
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
                ) : (
                    <Text style={styles.story}>{story}</Text>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingTop: 20,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 15,
    },
    loading: {
        marginTop: 20,
    },
    story: {
        marginTop: 20,
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'left',
    },
});