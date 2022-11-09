import useCachedResources from './core/hooks/useCachedResources';
import Navigation from './navigation';
import {Provider} from "react-redux";
import {store} from "./core/store";
import {SafeAreaView} from "react-native";

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) return null;

  return (
    <Provider store={store}>
      <SafeAreaView style={{ flex: 1 }}>
        <Navigation />
      </SafeAreaView>
    </Provider>
  );
}
