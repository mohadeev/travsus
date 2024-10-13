import * as React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface CollapsiblePanelProps {
	label: string
	children: React.ReactNode
	disabled?: boolean
	expanded: boolean
	onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void
	isFirst?: boolean
	isLast?: boolean
}

export default function CollapsiblePanel({
	label,
	children,
	disabled = false,
	expanded,
	onChange,
	isFirst = false,
	isLast = false,
}: CollapsiblePanelProps) {
	return (
		<Accordion
			disabled={disabled}
			expanded={expanded}
			onChange={onChange}
			sx={{
				mb: isLast ? 0 : 2,
				borderRadius: '10px',
				border: '1px solid #C7D2FE',
				overflow: 'hidden',
				'&:before': {
					display: 'none',
				},
				'& .MuiAccordionSummary-root': {
					borderBottom: expanded ? '1px solid #C7D2FE' : 'none',
				},
				'&:first-of-type': {
					borderTopLeftRadius: '10px',
					borderTopRightRadius: '10px',
				},
				'&:last-of-type': {
					borderBottomLeftRadius: '10px',
					borderBottomRightRadius: '10px',
					mb: 0,
				},
			}}
		>
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls={`${label}-content`}
				id={`${label}-header`}
			>
				<Typography>{label}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<Typography component="div">{children}</Typography>
			</AccordionDetails>
		</Accordion>
	)
}
