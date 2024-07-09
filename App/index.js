// Filename: index.js
// Combined code from all files
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Button, ScrollView, View, ActivityIndicator, Switch, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function extractTitle(story) {
    return story.split('.')[0].slice(0, 20) + '...';
}

function HomeScreen({ navigation }) {
    const [heroes, setHeroes] = useState('');
    const [villains, setVillains] = useState('');
    const [plot, setPlot] = useState('');
    const [loading, setLoading] = useState(false);
    const [stories, setStories] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const generateStory = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://apihub.p.appply.xyz:3300/chatgpt', {
                messages: [
                    { role: "system", content: "You are a helpful assistant. Please create a fairy tale based on the given heroes, villains, and plot." },
                    { role: "user", content: `Heroes: ${heroes}, Villains: ${villains}, Plot: ${plot}` }
                ],
                model: "gpt-4o"
            });
            const resultString = response.data.response;
            const title = extractTitle(resultString);
            setStories([...stories, { title, content: resultString }]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSwitch = () => setIsDarkMode(previousState => !previousState);

    const backgroundColor = isDarkMode ? '#333333' : '#FFFFFF';
    const textColor = isDarkMode ? '#FFFFFF' : '#000000';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.title, { color: textColor }]}>Fairy Tale Generator</Text>
                <TextInput
                    style={[styles.input, { color: textColor, borderColor: textColor }]}
                    placeholder="Enter Heroes..."
                    placeholderTextColor={isDarkMode ? '#CCCCCC' : '#999999'}
                    value={heroes}
                    onChangeText={setHeroes}
                />
                <TextInput
                    style={[styles.input, { color: textColor, borderColor: textColor }]}
                    placeholder="Enter Villains..."
                    placeholderTextColor={isDarkMode ? '#CCCCCC' : '#999999'}
                    value={villains}
                    onChangeText={setVillains}
                />
                <TextInput
                    style={[styles.input, { color: textColor, borderColor: textColor }]}
                    placeholder="Enter Plot..."
                    placeholderTextColor={isDarkMode ? '#CCCCCC' : '#999999'}
                    value={plot}
                    onChangeText={setPlot}
                />
                <Button title="Generate Fairy Tale" onPress={generateStory} />
                {loading ? (
                    <ActivityIndicator size="large" color={textColor} style={styles.loading} />
                ) : (
                    stories.map((story, index) => (
                        <TouchableOpacity key={index} onPress={() => navigation.navigate('StoryDetail', { story, isDarkMode })}>
                            <Text style={[styles.storyTitle, { color: textColor }]}>{story.title}</Text>
                        </TouchableOpacity>
                    ))
                )}
                <View style={styles.switchContainer}>
                    <Text style={[styles.switchLabel, { color: textColor }]}>Dark Mode</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isDarkMode}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function StoryDetailScreen({ route }) {
    const { story, isDarkMode } = route.params;
    const backgroundColor = isDarkMode ? '#333333' : '#FFFFFF';
    const textColor = isDarkMode ? '#FFFFFF' : '#000000';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.title, { color: textColor }]}>{story.title}</Text>
                <Text style={[styles.story, { color: textColor }]}>{story.content}</Text>
                <Button title="Back" onPress={() => navigation.goBack()} />
            </ScrollView>
        </SafeAreaView>
    );
}

const Stack = createStackNavigator();

export default function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
            <Stack.Navigator
                screenOptions={{
                    headerStyle: {
                        backgroundColor: isDarkMode ? '#333333' : '#FFFFFF',
                    },
                    headerTintColor: isDarkMode ? '#FFFFFF' : '#000000',
                }}
            >
                <Stack.Screen name="Home">
                    {props => <HomeScreen {...props} />}
                </Stack.Screen>
                <Stack.Screen name="StoryDetail">
                    {props => <StoryDetailScreen {...props} />}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    storyTitle: {
        fontSize: 18,
        marginTop: 10,
        textDecorationLine: 'underline',
    },
    switchContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    switchLabel: {
        fontSize: 16,
        marginBottom: 10,
    },
});