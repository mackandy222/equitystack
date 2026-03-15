export const AGREEMENT_TEMPLATES: Record<string, string> = {
  equity_grant: `EQUITY GRANT AGREEMENT

Date: {{DATE}}

BETWEEN:
1. {{COMPANY_NAME}} (the "Company"), represented by {{FOUNDER_NAME}}
2. {{EXECUTIVE_NAME}} (the "Recipient")

RECITALS:
The Company wishes to grant equity to the Recipient in consideration for services
rendered as {{ROLE}} on a fractional basis.

1. GRANT OF EQUITY
   The Company hereby grants to the Recipient shares in the Company, subject to the
   vesting schedule set out in the accompanying Vesting Schedule document.

2. SERVICES
   The Recipient agrees to provide {{HOURS_PER_MONTH}} hours per month of services
   in the capacity of {{EXECUTIVE_TITLE}} / {{ROLE}}.

3. VESTING
   Equity shall vest in accordance with the Vesting Schedule. Unvested equity shall
   be forfeited upon termination of this agreement.

4. REPRESENTATIONS
   The Recipient acknowledges that:
   a) The shares are illiquid and may have no market value
   b) The Company is an early-stage business with inherent risks
   c) The Recipient has received independent advice or waived the right to do so

5. TERMINATION
   Either party may terminate this agreement with 30 days written notice.
   Vested equity remains with the Recipient. Unvested equity is forfeited.

6. GOVERNING LAW
   This agreement is governed by the laws of England and Wales.

SIGNED:

_________________________          _________________________
{{FOUNDER_NAME}}                   {{EXECUTIVE_NAME}}
For {{COMPANY_NAME}}               Recipient
`,

  consulting_agreement: `CONSULTING AGREEMENT

Date: {{DATE}}

BETWEEN:
1. {{COMPANY_NAME}} (the "Company"), represented by {{FOUNDER_NAME}}
2. {{EXECUTIVE_NAME}} (the "Consultant")

1. ENGAGEMENT
   The Company engages the Consultant to provide services as {{ROLE}} on a
   fractional basis of approximately {{HOURS_PER_MONTH}} hours per month.

2. COMPENSATION
   The Consultant shall be compensated solely through equity in the Company,
   as detailed in the accompanying Equity Grant Agreement and Vesting Schedule.

3. INDEPENDENT CONTRACTOR
   The Consultant is an independent contractor, not an employee. The Consultant
   is responsible for their own tax obligations.

4. CONFIDENTIALITY
   The Consultant agrees to keep confidential all proprietary information of
   the Company.

5. INTELLECTUAL PROPERTY
   All work product created by the Consultant in the course of their engagement
   shall be the property of the Company.

6. TERM AND TERMINATION
   This agreement commences on {{DATE}} and continues until terminated by either
   party with 30 days written notice.

7. GOVERNING LAW
   This agreement is governed by the laws of England and Wales.

SIGNED:

_________________________          _________________________
{{FOUNDER_NAME}}                   {{EXECUTIVE_NAME}}
For {{COMPANY_NAME}}               Consultant
`,

  nda: `NON-DISCLOSURE AGREEMENT

Date: {{DATE}}

BETWEEN:
1. {{COMPANY_NAME}} (the "Disclosing Party"), represented by {{FOUNDER_NAME}}
2. {{EXECUTIVE_NAME}} (the "Receiving Party")

1. PURPOSE
   The parties wish to explore a potential engagement where {{EXECUTIVE_NAME}}
   would serve as {{ROLE}} for {{COMPANY_NAME}}.

2. CONFIDENTIAL INFORMATION
   "Confidential Information" means all information disclosed by the Disclosing
   Party including but not limited to: business plans, financial data, customer
   lists, technology, trade secrets, and cap table information.

3. OBLIGATIONS
   The Receiving Party agrees to:
   a) Keep all Confidential Information strictly confidential
   b) Not disclose it to any third party without prior written consent
   c) Use it only for the purpose stated above
   d) Return or destroy all materials upon request

4. DURATION
   This agreement remains in effect for 2 years from the date above.

5. GOVERNING LAW
   This agreement is governed by the laws of England and Wales.

SIGNED:

_________________________          _________________________
{{FOUNDER_NAME}}                   {{EXECUTIVE_NAME}}
For {{COMPANY_NAME}}
`,

  ip_assignment: `INTELLECTUAL PROPERTY ASSIGNMENT

Date: {{DATE}}

BETWEEN:
1. {{COMPANY_NAME}} (the "Company"), represented by {{FOUNDER_NAME}}
2. {{EXECUTIVE_NAME}} (the "Assignor")

1. ASSIGNMENT
   The Assignor hereby assigns to the Company all right, title, and interest in
   any intellectual property created during the course of their engagement as
   {{ROLE}} for the Company.

2. SCOPE
   This includes inventions, designs, code, processes, documentation, and any
   other work product created using Company resources or related to Company business.

3. PRIOR WORK
   The Assignor retains rights to any intellectual property created prior to this
   engagement and listed in Schedule A.

4. GOVERNING LAW
   This agreement is governed by the laws of England and Wales.

SIGNED:

_________________________          _________________________
{{FOUNDER_NAME}}                   {{EXECUTIVE_NAME}}
For {{COMPANY_NAME}}               Assignor
`,

  board_observer: `BOARD OBSERVER AGREEMENT

Date: {{DATE}}

BETWEEN:
1. {{COMPANY_NAME}} (the "Company"), represented by {{FOUNDER_NAME}}
2. {{EXECUTIVE_NAME}} (the "Observer")

1. APPOINTMENT
   The Company appoints {{EXECUTIVE_NAME}} as a Board Observer in connection
   with their role as {{ROLE}}.

2. RIGHTS
   The Observer shall have the right to:
   a) Attend all board meetings
   b) Receive all materials distributed to board members
   c) Participate in discussions (without voting rights)

3. CONFIDENTIALITY
   The Observer agrees to keep all board discussions and materials confidential.

4. TERM
   This appointment continues for as long as the Observer's engagement with
   the Company remains active.

5. GOVERNING LAW
   This agreement is governed by the laws of England and Wales.

SIGNED:

_________________________          _________________________
{{FOUNDER_NAME}}                   {{EXECUTIVE_NAME}}
For {{COMPANY_NAME}}               Observer
`,
};
