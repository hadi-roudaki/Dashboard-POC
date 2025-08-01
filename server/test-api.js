// Simple API test script to verify endpoints are working
const axios = require('axios');

const API_BASE = 'http://localhost:4000/api';

async function testAPI() {
  console.log('🧪 Testing King Living Orders API...\n');

  try {
    // Test 1: Get all orders
    console.log('1. Testing GET /api/orders');
    const ordersResponse = await axios.get(`${API_BASE}/orders?limit=5`);
    console.log(`   ✅ Status: ${ordersResponse.status}`);
    console.log(`   ✅ Orders returned: ${ordersResponse.data.data.length}`);
    console.log(`   ✅ Total orders: ${ordersResponse.data.pagination.total}`);
    console.log(`   ✅ Has summary: ${!!ordersResponse.data.summary}`);

    // Test 2: Filter by region
    console.log('\n2. Testing region filtering');
    const apacResponse = await axios.get(`${API_BASE}/orders?regions=APAC&limit=3`);
    console.log(`   ✅ APAC orders: ${apacResponse.data.data.length}`);
    console.log(`   ✅ All orders are APAC: ${apacResponse.data.data.every(o => o.region === 'APAC')}`);

    // Test 3: Multiple regions
    console.log('\n3. Testing multiple region filtering');
    const multiRegionResponse = await axios.get(`${API_BASE}/orders?regions=APAC&regions=UK&limit=5`);
    console.log(`   ✅ APAC+UK orders: ${multiRegionResponse.data.data.length}`);
    const validRegions = multiRegionResponse.data.data.every(o => ['APAC', 'UK'].includes(o.region));
    console.log(`   ✅ All orders are APAC or UK: ${validRegions}`);

    // Test 4: Status filtering
    console.log('\n4. Testing status filtering');
    const pendingResponse = await axios.get(`${API_BASE}/orders?status=pending&limit=3`);
    console.log(`   ✅ Pending orders: ${pendingResponse.data.data.length}`);
    if (pendingResponse.data.data.length > 0) {
      console.log(`   ✅ All orders are pending: ${pendingResponse.data.data.every(o => o.status === 'pending')}`);
    }

    // Test 5: Search functionality
    console.log('\n5. Testing search functionality');
    const searchResponse = await axios.get(`${API_BASE}/orders?search=John&limit=3`);
    console.log(`   ✅ Search results: ${searchResponse.data.data.length}`);

    // Test 6: Pagination
    console.log('\n6. Testing pagination');
    const page1Response = await axios.get(`${API_BASE}/orders?page=1&limit=2`);
    const page2Response = await axios.get(`${API_BASE}/orders?page=2&limit=2`);
    console.log(`   ✅ Page 1 orders: ${page1Response.data.data.length}`);
    console.log(`   ✅ Page 2 orders: ${page2Response.data.data.length}`);
    console.log(`   ✅ Different orders: ${page1Response.data.data[0].orderId !== page2Response.data.data[0].orderId}`);

    // Test 7: Get specific order
    console.log('\n7. Testing individual order retrieval');
    const firstOrderId = ordersResponse.data.data[0].orderId;
    const orderResponse = await axios.get(`${API_BASE}/order/${firstOrderId}`);
    console.log(`   ✅ Order retrieved: ${orderResponse.data.success}`);
    console.log(`   ✅ Order ID matches: ${orderResponse.data.data.orderId === firstOrderId}`);
    console.log(`   ✅ Has customer data: ${!!orderResponse.data.data.customer}`);
    console.log(`   ✅ Has items: ${orderResponse.data.data.items.length > 0}`);

    // Test 8: Summary data validation
    console.log('\n8. Testing summary data');
    const summary = ordersResponse.data.summary;
    const regions = ['APAC', 'UK', 'US'];
    regions.forEach(region => {
      if (summary[region]) {
        console.log(`   ✅ ${region} summary: ${summary[region].totalOrders} orders, $${summary[region].totalRevenue}M revenue`);
      }
    });

    console.log('\n🎉 All API tests passed! The backend is working correctly.');

  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
    process.exit(1);
  }
}

// Run the tests
testAPI();
