// store.js
import { create } from 'zustand'
import axios from 'axios';

const useStore = create(set => ({

  //---------------------------------------------------------------------------------- cbGroup
  data_1: null,
  loading_1: true,
  error_1: null,
  fetchData_1: async () => {
    set({ loading_1: true, error_1: null })
    try {
      const response = await axios.get('/api/v1/items/sidebar/group', {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_API_KEY || '',
        },
      })
      const data = response.data
      set({ data_1: data, loading_1: false })
    } catch (error) {
      set({ error_1: error.message, loading_1: false })
    }
  },

  //---------------------------------------------------------------------------------- ddlDepartment
  data_2: null,
  loading_2: true,
  error_2: null,

  fetchData_2: async () => {
    try {
      const response = await axios.get('/api/v1/log_in/ddlDepartment', {
        headers: { 'apikey': process.env.NEXT_PUBLIC_API_KEY || '' }
      })
      set({ data_2: response.data.data.departments, loading_2: false })
    } catch (error) {
      set({ error_2: error.message, loading_2: false })
    }
  },

  //---------------------------------------------------------------------------------- ddlProduct
  data_3: null,
  loading_3: true,
  error_3: null,
  fetchData_3: async (department) => {
    set({ loading_3: true, error_3: null })
    try {
      const response = await axios.post('/api/v1/items/sidebar/product',
        { department },
        {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        }
      )
      const data = response.data
      set({ data_3: data, loading_3: false })
    } catch (error) {
      set({ error_3: error.message, loading_3: false })
    }
  },

  //---------------------------------------------------------------------------------- JWTdecode
  data_4: null,
  loading_4: true,
  error_4: null,
  fetchData_4: async () => {
    set({ loading_4: true, error_4: null })
    try {
      const response = await axios.get('/api/v1/items/decode', {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_API_KEY || '',
        },
      })
      const data = response.data
      set({ data_4: data, loading_4: false })
    } catch (error) {
      set({ error_4: error.message, loading_4: false })
    }
  },

  //---------------------------------------------------------------------------------- ddlMachine
  data_5: null,
  loading_5: true,
  error_5: null,
  fetchData_5: async (department, product) => {
    set({ loading_5: true, error_5: null })
    try {
      const response = await axios.post('/api/v1/items/sidebar/machine',
        { department, product },
        {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        }
      )
      const data = response.data
      set({ data_5: data, loading_5: false })
    } catch (error) {
      set({ error_5: error.message, loading_5: false })
    }
  },


  //---------------------------------------------------------------------------------- image_test
  // data_6: null,
  // loading_6: true,
  // error_6: null,
  // fetchData_6: async () => {
  //   set({ loading_6: true, error_6: null })

  //   try {
  //     const response = await fetch('/api/v1/request/part', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'apikey': process.env.NEXT_PUBLIC_API_KEY || '',
  //       },
  //     })

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch image data')
  //     }

  //     const blob = await response.blob()
  //     const blobUrl = URL.createObjectURL(blob)

  //     set({ data_6: blobUrl, loading_6: false })

  //   } catch (error) {
  //     set({ error_6: error.message, loading_6: false })
  //   }
  // },

  //---------------------------------------------------------------------------------- Query catalog part
  data_7: null,
  loading_7: true,
  error_7: null,
  fetchData_7: async (department, product, machine, group) => {
    set({ loading_7: true, error_7: null })
    try {
      const response = await axios.post('/api/v1/items/sidebar/search',
        { department, product, machine, group },
        {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_API_KEY || '',
          },
        }
      )
      const data = response.data
      set({ data_7: data, loading_7: false })
    } catch (error) {
      set({ error_7: error.message, loading_7: false })
    }
  },

  //---------------------------------------------------------------------------------- Search items from sidebar
  data_8: null,
  loading_8: false,
  error_8: null,
  fetchData_8: async (searchParams) => {
    set({ loading_8: true, error_8: null })
    try {
      const response = await axios.post('/api/v1/items/sidebar/search',
        searchParams,
        { headers: { 'apikey': process.env.NEXT_PUBLIC_API_KEY || '' } })
      const data = response.data
      set({ data_8: data, loading_8: false })

    } catch (error) {
      set({ error_8: error.response.data.message, loading_8: false })
    }
  },

  //---------------------------------------------------------------------------------- Request part
  // data_9: null,
  // loading_9: false,
  // error_9: null,
  // fetchData_9: async (searchParams) => {
  //   set({ loading_9: true, error_9: null })
  //   try {
  //     const response = await axios.post('/api/v1/request/part',
  //       searchParams,
  //       { headers: { 'apikey': process.env.NEXT_PUBLIC_API_KEY || '' } })
  //     const data = response.data
  //     set({ data_9: data, loading_9: false })

  //   } catch (error) {
  //     set({ error_9: error.response.data.message, loading_9: false })
  //   }
  // },

  //---------------------------------------------------------------------------------- Request part
  data_10: null,
  loading_10: true,
  error_10: null,
  fetchData_10: async (id) => {
    set({ loading_10: true, error_10: null })
    try {
      const response = await axios.post('/api/v1/request/part', { id }, {
        headers: { 'apikey': process.env.NEXT_PUBLIC_API_KEY || '' }
      })
      set({ data_10: response.data, loading_10: false })
    } catch (error) {
      set({ error_10: error.message, loading_10: false })
    }
  },

  //---------------------------------------------------------------------------------- submit request (mn_production)
  data_11: null,
  loading_11: true,
  error_11: null,
  fetchData_11: async (requestData) => {
    set({ loading_11: true, error_11: null })
    try {
      const response = await axios.post('/api/v1/request/submit/mn/production', requestData, {
        headers: { 'apikey': process.env.NEXT_PUBLIC_API_KEY || '' }
      })
      set({ data_11: response.data, loading_11: false })
    } catch (error) {
      set({ error_11: error.message, loading_11: false })
    }
  },

  //---------------------------------------------------------------------------------- request format (mn_indirect)
  data_12: null,
  loading_12: true,
  error_12: null,
  fetchData_12: async (department) => {
    set({ loading_12: true, error_12: null })
    try {
      const response = await axios.post('/api/v1/request/format/mn_indirect',
        { department },
        {
          headers: { 'apikey': process.env.NEXT_PUBLIC_API_KEY || '' }
        })
      set({ data_12: response.data, loading_12: false })
    } catch (error) {
      set({ error_12: error.message, loading_12: false })
    }
  },


  //---------------------------------------------------------------------------------- mn_code
  data_13: null,
  loading_13: true,
  error_13: null,
  fetchData_13: async () => {
    set({ loading_13: true, error_13: null })
    try {
      const response = await axios.get('/api/v1/request/mn_code', {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_API_KEY || '',
        },
      })
      const data = response.data
      set({ data_13: data, loading_13: false })
    } catch (error) {
      set({ error_13: error.message, loading_13: false })
    }
  },

  //---------------------------------------------------------------------------------- submit request (mn_indirect)
  data_14: null,
  loading_14: true,
  error_14: null,
  fetchData_14: async (requestData) => {
    set({ loading_14: true, error_14: null })
    try {
      const response = await axios.post('/api/v1/request/submit/mn/indirect', requestData, {
        headers: { 'apikey': process.env.NEXT_PUBLIC_API_KEY || '' }
      })
      set({ data_14: response.data, loading_14: false })
    } catch (error) {
      set({ error_14: error.message, loading_14: false })
    }
  },

  //---------------------------------------------------------------------------------- submit request (sec_production)
  data_15: null,
  loading_15: true,
  error_15: null,
  fetchData_15: async (requestData) => {
    set({ loading_15: true, error_15: null })
    try {
      const response = await axios.post('/api/v1/request/submit/section/production', requestData, {
        headers: { 'apikey': process.env.NEXT_PUBLIC_API_KEY || '' }
      })
      set({ data_15: response.data, loading_15: false })
    } catch (error) {
      set({ error_15: error.message, loading_15: false })
    }
  },

  //---------------------------------------------------------------------------------- submit request (sec_indirect)
  data_16: null,
  loading_16: true,
  error_16: null,
  fetchData_16: async (requestData) => {
    set({ loading_16: true, error_16: null })
    try {
      const response = await axios.post('/api/v1/request/submit/section/indirect', requestData, {
        headers: { 'apikey': process.env.NEXT_PUBLIC_API_KEY || '' }
      })
      set({ data_16: response.data, loading_16: false })
    } catch (error) {
      set({ error_16: error.message, loading_16: false })
    }
  },

  //---------------------------------------------------------------------------------- submit request (dept_indirect)
  data_17: null,
  loading_17: true,
  error_17: null,
  fetchData_17: async (requestData) => {
    set({ loading_17: true, error_17: null })
    try {
      const response = await axios.post('/api/v1/request/submit/section/indirect', requestData, {
        headers: { 'apikey': process.env.NEXT_PUBLIC_API_KEY || '' }
      })
      set({ data_17: response.data, loading_17: false })
    } catch (error) {
      set({ error_17: error.message, loading_17: false })
    }
  },

  //---------------------------------------------------------------------------------- table monitoring 
  data_18: null,
  loading_18: false,
  error_18: null,
  fetchData_18: async (department) => {
    set({ loading_18: true, error_18: null })
    try {
      const response = await axios.post('/api/v1/monitoring',
        { department },
        {
          headers: { 'apikey': process.env.NEXT_PUBLIC_API_KEY || '' }
        })
      set({ data_18: response.data, loading_18: false })
    } catch (error) {
      set({ error_18: error.message, loading_18: false })
    }
  },

  //---------------------------------------------------------------------------------- ci payout waiting table 
  data_19: null,
  loading_19: false,
  error_19: null,
  fetchData_19: async (department) => {
    set({ loading_19: true, error_19: null })
    try {
      const response = await axios.post('/api/v1/setting/ci_payout/waiting_part',
        { department },
        {
          headers: { 'apikey': process.env.NEXT_PUBLIC_API_KEY || '' }
        })
      set({ data_19: response.data, loading_19: false })
    } catch (error) {
      set({ error_19: error.message, loading_19: false })
    }
  },

  //---------------------------------------------------------------------------------- insert data into draft ci
  data_20: null,
  loading_20: false,
  error_20: null,
  fetchData_20: async (requestData) => {
    set({ loading_20: true, error_20: null })
    try {
      const response = await axios.post('/api/v1/setting/ci_payout/draft_ci',
        requestData,
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_20: response.data, loading_20: false })
    } catch (error) {
      set({ error_20: error.message, loading_20: false })
    }
  },

  //---------------------------------------------------------------------------------- update judgement req history
  data_21: null,
  loading_21: false,
  error_21: null,
  fetchData_21: async (update_req_jdm) => {
    set({ loading_21: true, error_21: null })
    try {
      const response = await axios.post('/api/v1/setting/ci_payout/update_adm_jdm',
        update_req_jdm,
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_21: response.data, loading_21: false })
    } catch (error) {
      set({ error_21: error.message, loading_21: false })
    }
  },

  //---------------------------------------------------------------------------------- get current admin
  data_22: null,
  loading_22: false,
  error_22: null,
  fetchData_22: async (department) => {
    set({ loading_22: true, error_22: null })
    try {
      const response = await axios.post('/api/v1/setting/admin_set/current_admin',
        { department },
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_22: response.data, loading_22: false })
    } catch (error) {
      set({ error_22: error.message, loading_22: false })
    }
  },

  //---------------------------------------------------------------------------------- admin registration 
  data_23: null,
  loading_23: false,
  error_23: null,
  fetchData_23: async (requestData) => {
    set({ loading_23: true, error_23: null })
    try {
      const response = await axios.post('/api/v1/setting/admin_set/registration',
        requestData,
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_23: response.data, loading_23: false })
    } catch (error) {
      set({ error_23: error.message, loading_23: false })
    }
  },

  //---------------------------------------------------------------------------------- setting spare part
  data_24: null,
  loading_24: false,
  error_24: null,
  fetchData_24: async (department) => {
    set({ loading_24: true, error_24: null })
    try {
      const response = await axios.post('/api/v1/setting/spare_part',
        { department },
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_24: response.data, loading_24: false })
    } catch (error) {
      set({ error_24: error.message, loading_24: false })
    }
  },

  //---------------------------------------------------------------------------------- setting spare part -> process list
  data_25: null,
  loading_25: false,
  error_25: null,
  fetchData_25: async (department) => {
    set({ loading_25: true, error_25: null })
    try {
      const response = await axios.post('/api/v1/setting/spare_part/process_list',
        { department },
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_25: response.data, loading_25: false })
    } catch (error) {
      set({ error_25: error.message, loading_25: false })
    }
  },

  //---------------------------------------------------------------------------------- setting spare part -> group list
  data_26: null,
  loading_26: false,
  error_26: null,
  fetchData_26: async (department) => {
    set({ loading_26: true, error_26: null })
    try {
      const response = await axios.post('/api/v1/setting/spare_part/group_list',
        { department },
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_26: response.data, loading_26: false })
    } catch (error) {
      set({ error_26: error.message, loading_26: false })
    }
  },

  //---------------------------------------------------------------------------------- setting spare part -> upload data
  data_27: null,
  loading_27: false,
  error_27: null,
  fetchData_27: async (requestData) => {
    set({ loading_27: true, error_27: null })
    try {
      const response = await axios.post('/api/v1/setting/spare_part/upload_data',
        requestData,
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_27: response.data, loading_27: false })
    } catch (error) {
      set({ error_27: error.message, loading_27: false })
    }
  },

  //---------------------------------------------------------------------------------- setting exp_budget -> datatable
  data_28: null,
  loading_28: false,
  error_28: null,
  fetchData_28: async (department, period) => {
    set({ loading_28: true, error_28: null })
    try {
      const response = await axios.post('/api/v1/setting/exp_budget/datatable',
        { department, period },
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_28: response.data, loading_28: false })
    } catch (error) {
      set({ error_28: error.message, loading_28: false })
    }
  },

  //---------------------------------------------------------------------------------- setting exp_budget -> ddl repiod
  data_29: null,
  loading_29: false,
  error_29: null,
  fetchData_29: async (department) => {
    set({ loading_29: true, error_29: null })
    try {
      const response = await axios.post('/api/v1/setting/exp_budget/period_list',
        { department },
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_29: response.data, loading_29: false })
    } catch (error) {
      set({ error_29: error.message, loading_29: false })
    }
  },

  //---------------------------------------------------------------------------------- setting exp_budget -> ddl ccc
  data_30: null,
  loading_30: false,
  error_30: null,
  fetchData_30: async (department) => {
    set({ loading_30: true, error_30: null })
    try {
      const response = await axios.post('/api/v1/setting/exp_budget/ccc',
        { department },
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_30: response.data, loading_30: false })
    } catch (error) {
      set({ error_30: error.message, loading_30: false })
    }
  },

  //---------------------------------------------------------------------------------- setting exp_budget -> insert new data
  data_31: null,
  loading_31: false,
  error_31: null,
  fetchData_31: async (requestData) => {
    set({ loading_31: true, error_31: null })
    try {
      const response = await axios.post('/api/v1/setting/exp_budget/register',
        requestData,
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_31: response.data, loading_31: false })
    } catch (error) {
      set({ error_31: error.message, loading_31: false })
    }
  },

  //---------------------------------------------------------------------------------- setting exp_budget -> update data
  data_32: null,
  loading_32: false,
  error_32: null,
  fetchData_32: async (requestData) => {
    set({ loading_32: true, error_32: null })
    try {
      const response = await axios.post('/api/v1/setting/exp_budget/update',
        requestData,
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_32: response.data, loading_32: false })
    } catch (error) {
      set({ error_32: error.message, loading_32: false })
    }
  },

  //---------------------------------------------------------------------------------- setting machine -> ddl pd & mc
  data_33: null,
  loading_33: false,
  error_33: null,
  fetchData_33: async (department) => {
    set({ loading_33: true, error_33: null })
    try {
      const response = await axios.post('/api/v1/setting/machine/ccc_pd',
        { department },
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_33: response.data, loading_33: false })
    } catch (error) {
      set({ error_33: error.message, loading_33: false })
    }
  },

  //---------------------------------------------------------------------------------- setting machine -> datatable
  data_34: null,
  loading_34: false,
  error_34: null,
  fetchData_34: async (pd_id) => {
    set({ loading_34: true, error_34: null })
    try {
      const response = await axios.post('/api/v1/setting/machine/datatable',
        { pd_id },
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_34: response.data, loading_34: false })
    } catch (error) {
      set({ error_34: error.message, loading_34: false })
    }
  },

  //---------------------------------------------------------------------------------- setting machine -> budget list
  data_35: null,
  loading_35: false,
  error_35: null,
  fetchData_35: async (department, ccc) => {
    set({ loading_35: true, error_35: null })
    try {
      const response = await axios.post('/api/v1/setting/machine/budget_list',
        { department, ccc },
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_35: response.data, loading_35: false })
    } catch (error) {
      set({ error_35: error.message, loading_35: false })
    }
  },

  //---------------------------------------------------------------------------------- setting machine -> registration
  data_36: null,
  loading_36: false,
  error_36: null,
  fetchData_36: async (requestData) => {
    set({ loading_36: true, error_36: null })
    try {
      const response = await axios.post('/api/v1/setting/machine/registration',
        requestData,
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_36: response.data, loading_36: false })
    } catch (error) {
      set({ error_36: error.message, loading_36: false })
    }
  },

  //---------------------------------------------------------------------------------- setting machine -> update data
  data_37: null,
  loading_37: false,
  error_37: null,
  fetchData_37: async (requestData) => {
    set({ loading_37: true, error_37: null })
    try {
      const response = await axios.post('/api/v1/setting/machine/update',
        requestData,
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_37: response.data, loading_37: false })
    } catch (error) {
      set({ error_37: error.message, loading_37: false })
    }
  },

  //---------------------------------------------------------------------------------- Navbar -> search part no.
  data_38: null,
  loading_38: false,
  error_38: null,
  fetchData_38: async (department) => {
    set({ loading_38: true, error_38: null })
    try {
      const response = await axios.post('/api/v1/items/search_part',
        { department },
        { headers: { apikey: process.env.NEXT_PUBLIC_API_KEY || '' } }
      )
      set({ data_38: response.data, loading_38: false })
    } catch (error) {
      set({ error_38: error.message, loading_38: false })
    }
  },

}))

export default useStore