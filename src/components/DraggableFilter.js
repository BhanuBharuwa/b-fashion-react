import React from 'react';
import {View, Text, Dimensions, StyleSheet, FlatList} from 'react-native';
import {List, Chip, TouchableRipple, Checkbox} from 'react-native-paper';
// import CheckBox from '@react-native-community/checkbox'
import DraggablePanel from 'react-native-draggable-panel';
import {ScrollView, State} from 'react-native-gesture-handler';
import {TabView, SceneMap} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const {useState, useEffect} = React;
const routes = [{key: 'area', title: 'Area'}];
const DraggableFilter = ({isVisible, onDismiss, areas}) => {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = React.useState(0);
  const initialLayout = {width: Dimensions.get('window').width};
  const [selected, setSelected] = React.useState(false);

  useEffect(() => {
    setVisible(isVisible);
  }, [isVisible]);

  const filters = (index, status) => {
    let statusArr = selected;
    statusArr[index].status = status;
    setSelected(statusArr);
  };

  const AreaTab = () => (
    <Checkbox
      status={selected ? 'checked' : 'unchecked'}
      onPress={() => {
        setSelected(!selected);
      }}
    />
  );

  const renderScene = SceneMap({
    area: AreaTab,
  });

  return (
    <DraggablePanel
      visible={visible}
      onDismiss={() => onDismiss()}
      expandable={true}>
      <View style={styles.container}>
        <TabView
          lazy={true}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
        />
      </View>
    </DraggablePanel>
  );
};

export default DraggableFilter;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
