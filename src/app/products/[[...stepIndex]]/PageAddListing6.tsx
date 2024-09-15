// Make sure this file has "use client" at the top if using Next.js 13 or newer
"use client"

import React, { FC } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import FormItem from '../FormItem'
import restrictedOrSpecialConsiderationGroups from '@/constants/restrictedOrSpecialConsiderationGroups'
import Select from '@/shared/Select'
import { title } from 'process'

// Ensure this component is marked for client-side rendering
const CheckboxesTags: FC = () => {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
    const checkedIcon = <CheckBoxIcon fontSize="small" />

    return (
        <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={restrictedOrSpecialConsiderationGroups.map((item)=>({title: item}))}
            disableCloseOnSelect
            getOptionLabel={(option) => option.title}
            renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props
                return (
                    <li key={key} {...optionProps}>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.title}
                    </li>
                )
            }}
            style={{ width: 500 }}
            renderInput={(params) => (
                <TextField {...params} label="Checkboxes" placeholder="Favorites" />
            )}
        />
    )
}



export interface PageAddListing3Props {}

const PageAddListing3: FC<PageAddListing3Props> = () => {
    return (
        <>
            <h2 className="text-2xl font-semibold">Size of your location</h2>
            <div className="w-14 border-b border-neutral-200 dark:border-neutral-700"></div>
            {/* FORM */}
            <div className="space-y-8">
                {/* ITEM */}
                <FormItem label="Who is this activity not suitable for? (optional)">
                    <span className="mt-2 block text-neutral-500 dark:text-neutral-400">
                        Add the types of travelers who should not join this activity, like
                        under 18s or pregnant women. This information appears on the
                        activity details page.
                    </span>
                    <CheckboxesTags />
                
                </FormItem>
            </div>
        </>
    )
}

export default PageAddListing3
