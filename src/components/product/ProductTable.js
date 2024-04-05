import {
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {DataTable, Modal, Portal, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {setSelectedItem} from '../../store/slices/order.slice';
import ProductDetails from './ProductDetails';
import {useRef, useState} from 'react';
import {getCloser} from '../../utils';

const {width} = Dimensions.get('window');
const {diffClamp} = Animated;
const headerHeight = 50 * 2;

const ProductTable = ({item}) => {
  const {selectedItem, carts} = useSelector(state => state.cart);
  const [showImage, setShowImage] = useState(false);

  let selectedImage = ''

  const dispatch = useDispatch();
  const defaultImg = 'https://cdn-icons-png.flaticon.com/512/4211/4211763.png';

  const ref = useRef(null);

  const scrollY = useRef(new Animated.Value(0));
  const scrollYClamped = diffClamp(scrollY.current, 0, headerHeight);

  const translateY = scrollYClamped.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -(headerHeight / 2)],
  });

  const translateYNumber = useRef();

  translateY.addListener(({value}) => {
    translateYNumber.current = value;
  });

  const handleScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: {y: scrollY.current},
        },
      },
    ],
    {
      useNativeDriver: true,
    },
  );

  const handleSnap = ({nativeEvent}) => {
    const offsetY = nativeEvent.contentOffset.y;
    if (
      !(
        translateYNumber.current === 0 ||
        translateYNumber.current === -headerHeight / 2
      )
    ) {
      if (ref.current) {
        try {
          ref.current.scrollToOffset({
            offset:
              getCloser(translateYNumber.current, -headerHeight / 2, 0) ===
              -headerHeight / 2
                ? offsetY + headerHeight / 2
                : offsetY - headerHeight / 2,
          });
        } catch (error) {}
      }
    }
  };

  const showImageDialog = imageUrl => (
    <Modal
      animationType="fade"
      transparent={false}
      onDismiss={() => setShowImage(false)}
      visible={showImage}
      contentContainerStyle={styles.dialogContainer}>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={()=>setShowImage(false)}>
            <Icon name='close' color="#fff" size={35} />
        </TouchableOpacity>
        
        <Image
          source={{
            uri: imageUrl ? imageUrl : defaultImg,
          }}
          style={styles.imageDialog}
        />
      </View>
    </Modal>
  );

  return (
    <View style={styles.product_container}>
      <DataTable style={{marginTop: 5}}>
        <Animated.View
          style={[styles.hidingContainer, , {transform: [{translateY}]}]}>
          <ProductDetails item={item} headerHeight={headerHeight} />
          <DataTable.Header
            style={{borderBottomWidth: 0, backgroundColor: '#fff'}}>
            <DataTable.Title
              style={[styles.cell_style, {flex: 3}]}
              textStyle={styles.table_title}>
              Name (UNIT)
            </DataTable.Title>
            {item?.sizes.map(e => (
              <DataTable.Title
                key={e}
                style={styles.cell_style}
                textStyle={styles.table_title}>
                Size ({e})
              </DataTable.Title>
            ))}
          </DataTable.Header>
        </Animated.View>

        <Animated.ScrollView
          scrollEventThrottle={16}
          onScroll={handleScroll}
          ref={ref}
          onMomentumScrollEnd={handleSnap}
          contentContainerStyle={{paddingBottom: 150, paddingTop: headerHeight}}
          showsVerticalScrollIndicator={false}>
          {item.type == 'simple' ? (
            <DataTable.Row borderless={true} style={{borderBottomWidth: 0}}>
              <DataTable.Cell
                style={[styles.cell_style, {flex: 3}]}
                textStyle={styles.table_title}>
                {`${item.name}\n(${item.units})`}
              </DataTable.Cell>

              {item?.sizes.map(e => {
                const index = carts?.findIndex(i => i.id == item._id + e);
                return (
                  <DataTable.Cell
                    onPress={() => {
                      dispatch(
                        setSelectedItem({
                          _id: item._id,
                          id: item._id + e,
                          size: e,
                          name: item.name,
                        }),
                      );
                    }}
                    style={[
                      styles.cell_style,
                      {
                        backgroundColor:
                          selectedItem?.id === item._id + e
                            ? '#F0f0f0'
                            : '#fff',
                      },
                    ]}
                    textStyle={styles.table_title}>
                    {carts[index]?.quantity}
                  </DataTable.Cell>
                );
              })}
            </DataTable.Row>
          ) : (
            item?.variants.map(product => (
              <DataTable.Row borderless={true} style={{borderBottomWidth: 0}}>
                <TouchableOpacity
                  onPress={() => {
                    selectedImage = product.photo_url
                    setShowImage(true)
                }}
                  style={[
                    styles.cell_style,
                    {
                      flex: 3,
                      flexDirection: 'row',
                    },
                  ]}>
                  <Image
                    source={{
                      uri: product.photo_url ? product.photo_url : defaultImg,
                    }}
                    style={styles.image}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      paddingHorizontal: 10,
                    }}>
                    {`${product.name}\n(${item.units})`}
                  </Text>
                </TouchableOpacity>

                {item?.sizes.map(e => {
                  const index = carts?.findIndex(i => i.id == product._id + e);
                  return (
                    <DataTable.Cell
                      onPress={() => {
                        dispatch(
                          setSelectedItem({
                            _id: product._id,
                            id: product._id + e,
                            size: e,
                            name: product.name,
                          }),
                        );
                      }}
                      style={[
                        styles.cell_style,
                        {
                          backgroundColor:
                            selectedItem?.id === product._id + e
                              ? '#F0f0f0'
                              : '#fff',
                        },
                      ]}
                      textStyle={styles.table_title}>
                      {carts[index]?.quantity}
                    </DataTable.Cell>
                  );
                })}
              </DataTable.Row>
            ))
          )}
        </Animated.ScrollView>
      </DataTable>
      <Portal>{showImageDialog(selectedImage)}</Portal>
    </View>
  );
};

export default ProductTable;

const styles = StyleSheet.create({
  product_container: {
    // width: '100%',
  },

  hidingContainer: {
    position: 'absolute',
    backgroundColor: '#1c1c1c',
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 1,
  },

  cell_style: {
    borderWidth: 0.3,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  table_title: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#000',
  },

  dialogContainer: {
    padding: 20,
  },

  imageContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center'
  },

  image: {
    height: 60,
    width: 60,
  },

  imageDialog: {
    width: 300,
    height: '100%',
  },
});
