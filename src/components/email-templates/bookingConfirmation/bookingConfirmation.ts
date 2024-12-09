import {
	filteredLineItems,
	totalAmountFiltredLineItems,
} from '@/utils/lineItemsUtils'
import { emailTemplatesFooter } from '../EmailTemplatesFooter'
import { emailTemplatesHeader } from '../EmailTemplatesHeader'
import { formatCurrency } from '@/utils/formatCurrency'

export const bookingConfirmation = async (data: any) => {
	const html = String.raw
	return html`<!doctype html>
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<link
					href="https://v1.fontapi.ir/css/SFProDisplay"
					rel="stylesheet"
				></link>
				<title>Booking Confirmation</title>
			</head>
			<body
				style="background-color: #fff; color: #000; margin: 0; padding: 0;  font-family: Helvetica, SF Pro Display, Inter Tight, Arial, sans-serif;"
			>
				<table width="100%" border="0" cellspacing="0" cellpadding="0">
					<tbody>
						<tr>
							<td align="center">
								<table
									width="100%"
									border="0"
									cellspacing="0"
									cellpadding="0"
									style="max-width: 500px;"
								>
									<tbody>
										<tr>
											<td>
												<!-- Header Section -->
												${emailTemplatesHeader()}
											</td>
										</tr>
										<tr>
											<td>
												<!-- Main Content Section -->
												<table
													width="100%"
													border="0"
													cellspacing="0"
													cellpadding="0"
												>
													<tbody>
														<tr>
															<td style="padding: 24px 0;">
																<table
																	width="100%"
																	border="0"
																	cellspacing="0"
																	cellpadding="0"
																>
																	<tbody>
																		<tr>
																			<td
																				style="font-size: 16px; line-height: 24px; color: #000; padding-bottom: 24px;"
																			>
																				Dear
																				${data.customer.accountData.firstname},
																				<br /><br />
																				We are pleased to confirm your booking
																				with Travsus. Please find below the
																				details of your reservation, along with
																				the attached invoice and summary for
																				your records.
																			</td>
																		</tr>
																	</tbody>
																</table>
															</td>
														</tr>
														<tr>
															<td style="padding-bottom: 24px;">
																<!-- Booked Tour Section -->
																<table
																	width="100%"
																	border="0"
																	cellspacing="0"
																	cellpadding="0"
																	style="border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;"
																>
																	<tbody>
																		<tr>
																			<td
																				style="width: 200px; padding: 16px; min-width:200px;"
																				valign="top"
																			>
																				<img
																					src="${data.tour.images[0]?.url}"
																					alt="${data.tour.name}"
																					style="width: 200px; height: 200px; object-fit: cover; border-radius: 8px;"
																				/>
																			</td>
																			<td style="padding: 16px;" valign="top" style="width: 200px; min-width:200px">
																				<table
																					width="100%"
																					border="0"
																					cellspacing="0"
																					cellpadding="0"
																				>
																					<tbody>
																						<tr>
																							<td style="padding-bottom: 8px;">
																								<span
																									style="display: inline-block; background-color: #000; color: #fff; font-size: 12px; padding: 4px 8px; border-radius: 4px;"
																								>
																									${'TOUR PACKAGE'}
																								</span>
																							</td>
																						</tr>
																						<tr>
																							<td>
																								<h2
																									style="margin: 0; line-height: 1.3; color: #000;  font-weight:700; font-size: 1.5rem;"
																								>
																									${data.tour.name}
																								</h2>
																							</td>
																						</tr>
																					</tbody>
																				</table>
																			</td>
																		</tr>
																	</tbody>
																</table>
															</td>
														</tr>
														<tr>
															<td style="padding-bottom: 24px;">
																<!-- Booking Breakdown Section -->
																<table
																	width="100%"
																	border="0"
																	cellspacing="0"
																	cellpadding="0"
																	style="border: 1px solid #e0e0e0; border-radius: 8px;"
																>
																	<tbody>
																		<tr>
																			<td style="padding: 24px;">
																				<table
																					width="100%"
																					border="0"
																					cellspacing="0"
																					cellpadding="0"
																				>
																					<tbody>
																						<tr>
																							<td
																								colspan="2"
																								style="font-size: 18px; font-weight: bold; padding-bottom: 16px; color: #000;"
																							>
																								Reservation Summary
																							</td>
																						</tr>
																						${filteredLineItems(data.lineItems)
																							.map(
																								(item: any) => `
																							<tr>
																								<td
																									style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; color: #000;"
																								>
																									${item.description}
																								</td>
																								<td
																									style="padding: 8px 0; border-bottom: 1px solid #e0e0e0; text-align: right; color: #000;"
																								>
																									${formatCurrency(item.totalPrice)} 
																								</td>
																							</tr>
																							`,
																							)
																							.join('')}
																						<tr>
																							<td
																								style="padding: 16px 0; font-weight: bold; color: #000;"
																							>
																								Total Amount
																							</td>
																							<td
																								style="padding: 16px 0; font-weight: bold; text-align: right; color: #000;"
																							>
																								${formatCurrency(totalAmountFiltredLineItems(data.lineItems))}
																							</td>
																						</tr>
																					</tbody>
																				</table>
																			</td>
																		</tr>
																	</tbody>
																</table>
															</td>
														</tr>
														<tr>
															<td style="padding-bottom: 24px;">
																<table
																	width="100%"
																	border="0"
																	cellspacing="0"
																	cellpadding="0"
																>
																	<tbody>
																		<tr>
																			<td
																				style="font-size: 16px; line-height: 24px; color: #000;"
																			>
																				For a comprehensive overview of your
																				reservation or to make any necessary
																				modifications, please click the button
																				below:
																				<br /><br />
																				<a
																					href="${data.bookingId}"
																					style="font-size: 16px; color: #fff; cursor: pointer; background-color: #000000; padding: 12px 24px; text-decoration: none; border-radius: 30px; display: inline-block;margin : 0 auto;"
																					>View Reservation Details</a
																				>
																				<br /><br />
																				Should you have any questions or require
																				further assistance, our customer support
																				team is available to ensure your
																				experience meets your expectations.
																				<br /><br />
																				We appreciate your choice to travel with
																				Travsus and look forward to providing
																				you with an exceptional experience.
																				<br /><br />
																				Best regards,
																				<br />
																				The Travsus Team
																				<br />
																				<a
																					href=${process.env.NEXT_PUBLIC_SITE_URL}
																					style="color: #000;"
																					>https://www.travsus.com</a
																				>
																			</td>
																		</tr>
																	</tbody>
																</table>
															</td>
														</tr>
														<tr>
															<td>
																<!-- Footer Section -->
																${emailTemplatesFooter()}
															</td>
														</tr>
													</tbody>
												</table>
											</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
					</tbody>
				</table>
			</body>
		</html>`
}
