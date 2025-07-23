import { updateServiceState } from '@/app/GlobalRedux/Features/creatingServiceSlice/creatingServiceSlice'
import { store } from '@/app/GlobalRedux/store'

const handleChangeCreateTour = ({  path,value, index }: any) => {
	store.dispatch(updateServiceState({ path: `service.${path}`, value: value }))
	return null
}

export default handleChangeCreateTour
