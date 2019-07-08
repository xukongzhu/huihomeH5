import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import workDetail from '@/components/work/detail/detail'
import picDetail from '@/components/work/picDetail/detail'
import ownerDetail from '@/components/owner/ownerDetail'
import designerDetail from '@/components/designer/designerDetail'
import pmDetail from '@/components/pm/pmDetail'
import supervisorDetail from '@/components/supervisor/supervisorDetail'
import serviceDetail from '@/components/service/serviceDetail'
import pleaseDesign from '@/components/pleaseDesign/pleaseDesign'
import workSingle from '@/components/work/single/workSingle'
import dynamicDetail from '@/components/project/dynamicDetail/dynamicDetail'
import aidDetail from '@/components/aid/aidDetail/aidDetail'
import followList from '@/components/followList/followList'
import guideDetail from '@/components/guide/guideDetail/guideDetail'
import aidAnswer from '@/components/aid/aidAnswer/aidAnswer'
import activityDetail from '@/components/activity/activityDetail/activityDetail'
import activitySign from '@/components/activity/activitySign/activitySign'
import subjectDetai from '@/components/subject/subjectDetai/subjectDetai'
import shopsList from '@/components/shopsList/shopsList'
import ownerBillDetail from '@/components/owner/ownerBill/ownerBillDetail'
import projectDetail from '@/components/project/projectDetail/projectDetail'
import projectList from '@/components/project/projectList/projectList'
import subjectList from '@/components/subject/subjectList/subjectList'
import renovationList from '@/components/renovation/renovationList/renovationList'
import cellDetail from '@/components/cell/cellDetail/cellDetail'
import myAssess from '@/components/myAssess/myAssess'
import addAssesses from '@/components/addAssesses/addAssesses'
import video from '@/components/assembly/video/video'
import text from '@/components/text/text'
Vue.use(Router)

export default new Router({
  //mode:'history',
  routes: [{
      path: '/workDetail',
      name: 'workDetail',
      component: workDetail,
    },
    {
      path: '/workSingle',
      name: 'workSingle',
      component: workSingle,
    },
    {
      path: '/picDetail',
      name: 'picDetail',
      component: picDetail
    },
    {
      path: '/ownerDetail',
      name: 'ownerDetail',
      component: ownerDetail
    },
    {
      path: '/designerDetail',
      name: 'designerDetail',
      component: designerDetail
    },
    {
      path: '/pmDetail',
      name: 'pmDetail',
      component: pmDetail
    },
    {
      path: '/supervisorDetail',
      name: 'supervisorDetail',
      component: supervisorDetail
    },
    {
      path: '/serviceDetail',
      name: 'serviceDetail',
      component: serviceDetail
    },
    {
      path: '/pleaseDesign',
      name: 'pleaseDesign',
      component: pleaseDesign
    },
    {
      path: '/dynamicDetail',
      name: 'dynamicDetail',
      component: dynamicDetail
    },
    {
      path: '/aidDetail',
      name: 'aidDetail',
      component: aidDetail
    },
    {
      path: '/followList',
      name: 'followList',
      component: followList
    },
    {
      path: '/guideDetail',
      name: 'guideDetail',
      component: guideDetail
    },
    {
      path: '/aidAnswer',
      name: 'aidAnswer',
      component: aidAnswer
    },
    {
      path: '/activityDetail',
      name: 'activityDetail',
      component: activityDetail
    },
    {
      path: '/activitySign',
      name: 'activitySign',
      component: activitySign
    },
    {
      path: '/subjectDetai',
      name: 'subjectDetai',
      component: subjectDetai
    },
    {
      path: '/shopsList',
      name: 'shopsList',
      component: shopsList
    },
    {
      path: '/ownerBillDetail',
      name: 'ownerBillDetail',
      component: ownerBillDetail
    },
    {
      path: '/projectDetail',
      name: 'projectDetail',
      component: projectDetail
    },
    {
      path: '/projectList',
      name: 'projectList',
      component: projectList
    },
    {
      path: '/subjectList',
      name: 'subjectList',
      component: subjectList
    },
    {
      path: '/renovationList',
      name: 'renovationList',
      component: renovationList
    },
    {
      path: '/cellDetail',
      name: 'cellDetail',
      component: cellDetail
    },
    {
      path: '/myAssess',
      name: 'myAssess',
      component: myAssess
    },
    {
      path: '/video',
      name: 'video',
      component: video
    },
    {
      path: '/addAssesses',
      name: 'addAssesses',
      component: addAssesses
    },
    {
      path: '/text',
      name: 'text',
      component: text
    },
  ]
})
