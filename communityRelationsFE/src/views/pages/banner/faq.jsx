import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Box,
  Paper,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const faqData = [
  {
    question: "I forgot my password, what should I do?",
    answer: [
      "1. Try to close your browser",
      "2. Log back in",
      "3. If it's still showing you an error, email the MIS Support Team."
    ]
  },
  {
    question: "I have already submitted a request, when will it be accepted?",
    answer: "Wait for the Community Relations Officer to review your request."
  },
  {
    question: "Where can I track my request?",
    answer: "You can track the status of your request through the 'History Page'."
  },
  {
    question: "What is the meaning of each status?",
    answer: [
      "Request - You have submitted/Edited the Request Form.",
      "Reviewed - Your request was declined and needs to be edited or deleted.",
      "Pending review for Comrel III - Waiting for Community Relations III's review.",
      "Pending review for Comrel DH - Waiting for the Department Head's review.",
      "Accepted - Your request has been approved and saved."
    ]
  },
  {
    question: "How can I edit the request?",
    answer: "You can only edit a request if your role is 'encoder' or 'admin'. The edit button will appear only if the request is still in review."
  },
  {
    question: "I accidentally deleted the request. What should I do?",
    answer: "You can either recreate the request or contact the MIS Support Team."
  }
];

export default function FAQ() {
  return (
    <Box sx={{ backgroundColor: '#ffdc73', minHeight: '100vh', py: 10 }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ borderRadius: 3, p: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 600,
              textAlign: 'left',
              fontSize: { xs: '1.8rem', sm: '2rem' },
            }}
          >
            Frequently Asked Questions
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box>
            {faqData.map((faq, index) => (
              <Accordion
                key={index}
                sx={{
                  borderRadius: 2,
                  boxShadow: 1,
                  mb: 1,
                  '&:before': { display: 'none' }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Typography sx={{ fontWeight: 500 }}>{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {Array.isArray(faq.answer) ? (
                    <Box component="ul" sx={{ pl: 3, m: 0 }}>
                      {faq.answer.map((item, idx) => (
                        <li key={idx}>
                          <Typography variant="body2" color="text.secondary">
                            {item}
                          </Typography>
                        </li>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {faq.answer}
                    </Typography>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" color="text.secondary">
            If you have any questions or suggestions, email us at{' '}
            <Box component="span" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
              adrian.ventura@lepantomining.com
            </Box>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}