import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  FlatList,
} from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import axios from 'axios';

const StatisticsScreen = () => {
  // State untuk dropdown year
  const [openYear, setOpenYear] = useState(false);
  const [selectedYear, setSelectedYear] = useState(moment().year());
  const [years, setYears] = useState([]);

  // State untuk dropdown month
  const [openMonth, setOpenMonth] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(moment().month() + 1);
  const [months, setMonths] = useState([]);

  // State lainnya
  const [period, setPeriod] = useState('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Generate years (5 tahun ke belakang)
    const currentYear = moment().year();
    const yearList = [];
    for (let i = 0; i < 5; i++) {
      yearList.push({
        label: String(currentYear - i),
        value: currentYear - i
      });
    }
    setYears(yearList);

    // Generate months
    const monthList = moment.months().map((month, index) => ({
      label: month,
      value: index + 1
    }));
    setMonths(monthList);
  }, []);

  useEffect(() => {
    fetchData();
  }, [period, selectedYear, selectedMonth]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let url = `http://192.168.100.59:5000/api/hydration/log?period=${period}`;
      
      if (period === 'monthly') {
        url += `&year=${selectedYear}&month=${selectedMonth}`;
        console.log('Fetching URL:', url);
      }
      
      const response = await axios.get(url);
      console.log('Response data:', response.data);
      setData(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error('Error fetching data:', err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (data) => {
    return data.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderFilters = () => {
    if (period !== 'monthly') return null;

    return (
      <View style={styles.filterContainer}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Year:</Text>
          <DropDownPicker
            open={openYear}
            value={selectedYear}
            items={years}
            setOpen={setOpenYear}
            setValue={setSelectedYear}
            style={styles.dropdown}
            dropDownContainerStyle={[
              styles.dropdownList, 
              { maxHeight: 200 }
            ]}
            modalProps={{
              animationType: "slide"
            }}
            modalTitle="Select Year"
            modalAnimationType="slide"
            listMode="MODAL"
            zIndex={2000}
            zIndexInverse={1000}
          />
        </View>
        <View style={[styles.dropdownContainer, { marginTop: openYear ? 150 : 10, zIndex: 1000 }]}>
          <Text style={styles.dropdownLabel}>Month:</Text>
          <DropDownPicker
            open={openMonth}
            value={selectedMonth}
            items={months}
            setOpen={setOpenMonth}
            setValue={setSelectedMonth}
            style={styles.dropdown}
            dropDownContainerStyle={[
              styles.dropdownList, 
              { maxHeight: 200 }
            ]}
            modalProps={{
              animationType: "slide"
            }}
            modalTitle="Select Month"
            modalAnimationType="slide"
            listMode="MODAL"
            zIndex={1000}
            zIndexInverse={2000}
          />
        </View>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <>
        <SegmentedControl
          values={['Daily', 'Weekly', 'Monthly']}
          selectedIndex={['daily', 'weekly', 'monthly'].indexOf(period)}
          onChange={(event) => {
            setPeriod(['daily', 'weekly', 'monthly'][event.nativeEvent.selectedSegmentIndex]);
          }}
          style={styles.segmentedControl}
        />
        {renderFilters()}
        {data?.length > 0 && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total Consumption: {calculateTotal(data)} ml
            </Text>
            <Text style={styles.periodText}>
              Period: {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </View>
        )}
      </>
    );
  };

  const renderItem = ({ item }) => {
    if (!item) return null;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
          <Text style={styles.time}>{formatTime(item.date)}</Text>
        </View>
        <Text style={styles.amount}>Amount: {item.amount} ml</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No data available</Text>
      }
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmentedControl: {
    marginBottom: 16,
    height: 40,
  },
  filterContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    zIndex: 1000,
  },
  dropdownContainer: {
    marginBottom: 10,
    zIndex: 1000,
  },
  dropdownLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dropdown: {
    borderColor: '#ddd',
    borderRadius: 8,
  },
  dropdownList: {
    borderColor: '#ddd',
    borderRadius: 8,
  },
  totalContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  periodText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  amount: {
    fontSize: 16,
    color: '#2196F3',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  }
});

export default StatisticsScreen;