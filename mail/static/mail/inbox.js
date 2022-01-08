document.addEventListener('DOMContentLoaded', function() {

	let inboxContainer = document.createElement('div');
	inboxContainer.setAttribute('id', 'inbox-container');
	document.querySelector('.container').append(inboxContainer);

	let sentPageContainer = document.createElement('div');
	sentPageContainer.setAttribute('id', 'sent-page-container');
	document.querySelector('.container').append(sentPageContainer);
	
	let archivePageContainer = document.createElement('div');
	archivePageContainer.setAttribute('id', 'archive-page-container');
	document.querySelector('.container').append(archivePageContainer);

	const openEmail = document.getElementById('email-page-container');
	const openarchive = document.getElementById('archive-email-container');
		if(openEmail){
			openEmail.parentNode.removeChild(openEmail);
		}
		if(openarchive){
			openarchive.parentNode.removeChild(openarchive);
		}
		
		
  // By default, load the inbox
  defaultPage();
	  
	  
//inbox 

function defaultPage(){
	load_mailbox('inbox');
	document.querySelector('#inbox-container').style.display = 'block';
	document.querySelector('#sent-page-container').style.display = 'none';
	document.querySelector('#archive-page-container').style.display = 'none';
}
 
document.querySelector('#inbox').addEventListener('click', function(){
	  window.location.reload();
	defaultPage();	
	document.querySelector('#sent-page-container').style.display = 'none';
	document.querySelector('#archive-page-container').style.display = 'none';
	
	const openEmail = document.getElementById('email-page-container');
	const openarchive = document.getElementById('archive-email-container');
		if(openEmail){
			openEmail.parentNode.removeChild(openEmail);
		}
		if(openarchive){
			openarchive.parentNode.removeChild(openarchive);
		}
});

// sent page  
document.querySelector('#sent').addEventListener('click', function(){
	  load_mailbox('sent');
	document.querySelector('#sent-page-container').style.display = 'block'; 
	document.querySelector('#inbox-container').style.display = 'none';
	document.querySelector('#archive-page-container').style.display = 'none';
	  
	const openEmail = document.getElementById('email-page-container');
	const openarchive = document.getElementById('archive-email-container');
		if(openEmail){
			openEmail.parentNode.removeChild(openEmail);
		}
		if(openarchive){
			openarchive.parentNode.removeChild(openarchive);
		}

  });
  
// archive page 
document.querySelector('#archived').addEventListener('click', function(){
	  load_mailbox('archived');
	document.querySelector('#archive-page-container').style.display = 'block';  
	document.querySelector('#inbox-container').style.display = 'none';
	document.querySelector('#sent-page-container').style.display = 'none';

	const openEmail = document.getElementById('email-page-container');
	const openarchive = document.getElementById('archive-email-container');
		if(openEmail){
			openEmail.parentNode.removeChild(openEmail);
		}
		if(openarchive){
			openarchive.parentNode.removeChild(openarchive);
		}
  });
  
// compose page
    document.querySelector('#compose').addEventListener('click', function(){
		compose_email();

	document.querySelector('#inbox-container').style.display = 'none';
	document.querySelector('#sent-page-container').style.display = 'none';
	document.querySelector('#archive-page-container').style.display = 'none';
				
	const openEmail = document.getElementById('email-page-container');
	const openarchive = document.getElementById('archive-email-container');
		if(openEmail){
			openEmail.parentNode.removeChild(openEmail);
		}
		if(openarchive){
			openarchive.parentNode.removeChild(openarchive);
		}
  });


// Inbox Page from API 
  // GET /emails/<str:mailbox>
  fetch('/emails/inbox') 
	.then(response => response.json())
	.then(emails => {	
	const allEmails = emails;
	const activeEmails = [];
	for (let i = 0; i < allEmails.length; i++){
		if (allEmails[i].archived == false){
			let emailContainer = document.createElement('div');
			emailContainer.setAttribute('id', 'email-container');
						
			emailContainer.innerHTML = `<div>${allEmails[i].sender}</div>
									<div>${allEmails[i].subject}</div>
									<div>${allEmails[i].timestamp}</div>`;			
			
			document.querySelector('#inbox-container').append(emailContainer);
			
			if (allEmails[i].read == false){
				emailContainer.style.background = "White";
			}else {
				emailContainer.style.background = "gray";
			}
		}
	}
	
	// click on email in inbox to go to email page
	const inboxEmails = document.querySelectorAll('#inbox-container #email-container');
	
	for(let i = 0; i < inboxEmails.length; i++){
		inboxEmails[i].addEventListener('click', function(){			
			const openEmail = document.getElementById('email-page-container');
			if(openEmail){
				openEmail.parentNode.removeChild(openEmail);
			}
			let emailPageContainer = document.createElement('div');
			emailPageContainer.setAttribute('id', 'email-page-container');
			document.querySelector('.container').append(emailPageContainer);
			
			const emailId = allEmails[i].id;
			
			//GET /emails/<int:email_id>
			fetch(`/emails/${emailId}`)
			.then(response => response.json())
			.then(email => {
				document.querySelector('#inbox-container').style.display = "none";
				document.querySelector('#emails-view').style.display = "none";
				
				let emailPageTitle = document.createElement('div');
				emailPageTitle.setAttribute('class', 'email-page-title');
				let emailPageBody = document.createElement('div');
				emailPageBody.setAttribute('class', 'email-page-body');
				
				emailPageTitle.innerHTML = `<div><b>From:</b> ${email.sender}<br>
											<b>To:</b> ${email.recipients}<br>
											<b>Subject:</b> ${email.subject}<br>
											<b>Timestamp:</b> ${email.timestamp}</div>
											<button id="email-page-reply" class="btn-outline-primary">Reply</button>
											<button id="email-page-Archive" class="btn-outline-primary">Archive</button>
											<button id="email-page-unread" class="btn-outline-primary">Unread</button>
											<hr>`;
				
				emailPageBody.innerHTML = email.body;				
				emailPageContainer.append(emailPageTitle);				
				emailPageContainer.append(emailPageBody);
								
				document.getElementById("email-page-Archive").onclick = function(){
					fetch(`/emails/${emailId}`, {
						method: 'PUT',
						body: JSON.stringify({
						archived: true
						})
					});
					
					window.location.reload();
						defaultPage();	
						document.querySelector('#sent-page-container').style.display = 'none';
						document.querySelector('#archive-page-container').style.display = 'none';
						
						const openEmail = document.getElementById('email-page-container');
						const openarchive = document.getElementById('archive-email-container');
							if(openEmail){
								openEmail.parentNode.removeChild(openEmail);
							}
							if(openarchive){
								openarchive.parentNode.removeChild(openarchive);
							}
				}
				
				document.getElementById("email-page-unread").onclick = function(){
					fetch(`/emails/${emailId}`, {
						method: 'PUT',
						body: JSON.stringify({
						read: false
						})
					});
				}
				
				document.getElementById("email-page-reply").onclick = function(){
					document.querySelector('#email-page-container').style.display = "none";
					compose_email();
					const composeRecipients = document.getElementById('compose-recipients');
					const composeSubject = document.getElementById('compose-subject');
					const replyBody = document.getElementById('compose-body');

					composeRecipients.value = email.sender;
					
					if(email.subject.includes("Re: ") == false){
						composeSubject.value = "Re: " + email.subject;
					}else {
						composeSubject.value = email.subject;
					}
					
					replyBody.value = `${email.id} On ${email.timestamp}, ${email.sender} wrote:\n ${email.body}\n`;
				}

			});			
			
			fetch(`/emails/${emailId}`, {
				method: 'PUT',
				body: JSON.stringify({
					read: true
				})
			});
			
		});
	}
	
});

	

// Archive page From API
// GET /emails/<str:mailbox>

fetch('/emails/archive')
.then(response => response.json())
.then(emails => {
	const allEmails = emails;
	let archiveEmails = [];
	for (let i = 0; i < allEmails.length; i++){		
		if (allEmails[i].archived == true){	
			let archiveContainer = document.createElement('div');
			archiveContainer.setAttribute('id', 'archive-container');
						
			archiveContainer.innerHTML = `<div>${allEmails[i].sender}</div>
									<div>${allEmails[i].subject}</div>
									<div>${allEmails[i].timestamp}</div>`;			
									
			document.querySelector('#archive-page-container').append(archiveContainer);	
		}
	}
		
	// click on email in archive to go to email page
	const archiveEmailsPage = document.querySelectorAll('#archive-page-container #archive-container');
	
	for(let i = 0; i < archiveEmailsPage.length; i++){
		archiveEmailsPage[i].addEventListener('click', function(){			
			const openArchive = document.getElementById('archive-email-container');
			if(openArchive){
				openArchive.parentNode.removeChild(openArchive);
			}
			let archiveEmailContainer = document.createElement('div');
			archiveEmailContainer.setAttribute('id', 'archive-email-container');
			document.querySelector('.container').append(archiveEmailContainer);
			
			const emailId = allEmails[i].id;
			
			//GET /emails/<int:email_id>
			fetch(`/emails/${emailId}`)
			.then(response => response.json())
			.then(email => {
				document.querySelector('#archive-page-container').style.display = "none";
				document.querySelector('#emails-view').style.display = "none";
				
				let emailPageTitle = document.createElement('div');
				emailPageTitle.setAttribute('class', 'email-page-title');
				let emailPageBody = document.createElement('div');
				emailPageBody.setAttribute('class', 'email-page-body');
				
				emailPageTitle.innerHTML = `<div><b>From:</b> ${email.sender}<br>
											<b>To:</b> ${email.recipients}<br>
											<b>Subject:</b> ${email.subject}<br>
											<b>Timestamp:</b> ${email.timestamp}</div>
											<button id="email-page-Active" class="btn-outline-primary">Unarchive</button>
											<hr>`;
											
				emailPageBody.innerHTML = email.body;				
				archiveEmailContainer.append(emailPageTitle);				
				archiveEmailContainer.append(emailPageBody);
								
				document.getElementById("email-page-Active").onclick = function(){
					fetch(`/emails/${emailId}`, {
						method: 'PUT',
						body: JSON.stringify({
						archived: false
						})
					});
					
					window.location.reload();
						defaultPage();	
						document.querySelector('#sent-page-container').style.display = 'none';
						document.querySelector('#archive-page-container').style.display = 'none';
						
						const openEmail = document.getElementById('email-page-container');
						const openarchive = document.getElementById('archive-email-container');
							if(openEmail){
								openEmail.parentNode.removeChild(openEmail);
							}
							if(openarchive){
								openarchive.parentNode.removeChild(openarchive);
							}
				}
			});
			
			
		});
	}	
	
});


// Sent page
// GET /emails/<str:mailbox>
	fetch('/emails/sent')
.then(response => response.json())
.then(emails => {
	const allEmails = emails;	
	const user = document.querySelector('.container > h2:first-of-type').innerHTML;	
	for (let i = 0; i < allEmails.length; i++){		
		if (allEmails[i].sender == user){
			let sentContainer = document.createElement('div');
			sentContainer.setAttribute('id', 'sent-container');
						
			sentContainer.innerHTML = `<div>To: ${allEmails[i].recipients}</div>
									<div>${allEmails[i].subject}</div>
									<div> ${allEmails[i].timestamp}</div>`;			
			
			document.querySelector('#sent-page-container').append(sentContainer);	
		}
	}	
	
// click on email in inbox to go to email page
	const sentEmails = document.querySelectorAll('#sent-page-container #sent-container');
	
	for(let i = 0; i < sentEmails.length; i++){
		sentEmails[i].addEventListener('click', function(){			
			const openSeEmail = document.getElementById('email-page-container');
			if(openEmail){
				openEmail.parentNode.removeChild(openEmail);
			}
			let emailPageContainer = document.createElement('div');
			emailPageContainer.setAttribute('id', 'email-page-container');
			document.querySelector('.container').append(emailPageContainer);
			
			const emailId = allEmails[i].id;
			
			//GET /emails/<int:email_id>
			fetch(`/emails/${emailId}`)
			.then(response => response.json())
			.then(email => {
				document.querySelector('#sent-page-container').style.display = "none";
				document.querySelector('#emails-view').style.display = "none";
				
				let emailPageTitle = document.createElement('div');
				emailPageTitle.setAttribute('class', 'email-page-title');
				let emailPageBody = document.createElement('div');
				emailPageBody.setAttribute('class', 'email-page-body');
				
				emailPageTitle.innerHTML = `<div><b>From:</b> ${email.sender}<br>
											<b>To:</b> ${email.recipients}<br>
											<b>Subject:</b> ${email.subject}<br>
											<b>Timestamp:</b>${email.timestamp}</div>
											<hr>`;
				
				emailPageBody.innerHTML = email.body;				
				emailPageContainer.append(emailPageTitle);				
				emailPageContainer.append(emailPageBody);
			});	
	});
	}
});

  
// Compose page - sent mail
  
  const emailForm = document.querySelector('#compose-form');  
  
  emailForm.onsubmit = function(e) {
	e.preventDefault();

	let recipients = document.querySelector('#compose-recipients').value;	
	let subject = document.querySelector('#compose-subject').value;	
	let body = document.querySelector('#compose-body').value;
		
	fetch('/emails', {
	method: 'POST',
	body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
	})
	})
	.then(response => response.json())
	.then(result => {
		// Print result
		console.log(result);
		if(result.error){
			let errorBox = document.createElement('div');
			errorBox.setAttribute('class', 'alert alert-danger');
			document.querySelector('.container').prepend(errorBox);
			errorBox.innerHTML = result.error;
		}
		if(result.message){
			//let messageBox = document.createElement('div');
			//messageBox.setAttribute('class', 'alert alert-success');
			//document.querySelector('#compose-view').prepend(messageBox);
			//messageBox.innerHTML = result.message;
			
			load_mailbox('sent');
			document.querySelector('#sent-page-container').style.display = 'block'; 
			document.querySelector('#inbox-container').style.display = 'none';
			document.querySelector('#archive-page-container').style.display = 'none';
			
			const openEmail = document.getElementById('email-page-container');
			const openarchive = document.getElementById('archive-email-container');
			if(openEmail){
				openEmail.parentNode.removeChild(openEmail);
			}
			if(openarchive){
				openarchive.parentNode.removeChild(openarchive);
			}
			
		}
	});
	
  }
  

  
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}