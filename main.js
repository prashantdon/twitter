let tweetOffset = 0;
let runningCriticalFunction = false;

async function getTweetsAndInsertHTML() {
    if (runningCriticalFunction) {
        return;
    }
    runningCriticalFunction = true;
    const result = await fetch(`https://twitter-backend-6yot.onrender.com/tweet/recent?offset=${tweetOffset}`);
    const tweets = await result.json();
    console.log(result)

    tweetOffset = tweetOffset + tweets.data.length;

    document.getElementById('tweet-body').insertAdjacentHTML('beforeend', tweets.data.map((tweet) => {
        const date = new Date(tweet.creationDatetime);

        return `<div id=${tweet._id} class="tweets">
        <div class="tweet-profile-image">
        <img
            src="https://th.bing.com/th/id/R.f267236bbca062de60909f46c187d00e?rik=l%2fzKfkvWRYzp%2fw&pid=ImgRaw&r=0"
            alt="profile image"
        />
        </div>
        <div class="tweet">
        <div class="tweet-header">
            <div class="tweet-user-info">
            <p><strong>Prashant</strong></p>
            <p> @Prashant </p>
            <p>${date.toDateString()}</p>
            </div>
            <div class="tweet-three-dots-menu">
            <button data-id=${tweet._id} class="tweet-edit" id="tweet-edit">
                Edit
            </button>
            <button data-id=${tweet._id} class="tweet-delete" id="tweet-delete">
                Delete
            </button>
            <button>
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                    fill="#5b7083"
                    d="M16.5 10.25c-.965 0-1.75.787-1.75 1.75s.784 1.75 1.75 1.75c.964 0 1.75-.786 1.75-1.75s-.786-1.75-1.75-1.75zm0 2.5c-.414 0-.75-.336-.75-.75 0-.413.337-.75.75-.75s.75.336.75.75c0 .413-.336.75-.75.75zm-4.5-2.5c-.966 0-1.75.787-1.75 1.75s.785 1.75 1.75 1.75 1.75-.786 1.75-1.75-.784-1.75-1.75-1.75zm0 2.5c-.414 0-.75-.336-.75-.75 0-.413.337-.75.75-.75s.75.336.75.75c0 .413-.336.75-.75.75zm-4.5-2.5c-.965 0-1.75.787-1.75 1.75s.785 1.75 1.75 1.75c.964 0 1.75-.786 1.75-1.75s-.787-1.75-1.75-1.75zm0 2.5c-.414 0-.75-.336-.75-.75 0-.413.337-.75.75-.75s.75.336.75.75c0 .413-.336.75-.75.75z"
                ></path>
                </svg>
            </button>
            </div>
        </div>
        <div class="tweet-body">
            <span id='span-${tweet._id}'>${tweet.title}
            </span>
        </div>
        </div>
    </div>`
    }).join(""))
    runningCriticalFunction = false
}
window.onload = async () => {
    getTweetsAndInsertHTML()
}

const tweetBtn = document.querySelector('.home-tweet');
tweetBtn.addEventListener('click', async (event) => {
    if (event.target.classList.contains('home-tweet')) {
        const tweetText = document.querySelector('.post-input').value;

        const data = {
            title: tweetText,
            text: "Random Value",
            userId: "123"
        }

        const tweetResponse = await fetch('https://twitter-backend-6yot.onrender.com/tweet/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        const tweet = await tweetResponse.json();

        if (tweet.status !== 200) {
            alert(tweet.message);
            return;
        }

        document.querySelector('.post-input').value = "";
        alert(tweet.message);
    }

    if (event.target.classList.contains('tweet-delete')) {

        if (confirm("Are you sure you want to delete this tweet?")) {
            const tweetId = event.target.getAttribute('data-id');

            const data = {
                tweetId,
                userId: "12345"
            };

            const response = await fetch('https://twitter-backend-6yot.onrender.com/tweet/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            const result = await response.json();

            if (result.status !== 200) {
                alert(result.message);
                return;
            }

            alert("Tweet deleted successfuly");
            document.getElementById(tweetId).remove();
        }
    }

    if (event.target.classList.contains('tweet-edit')) {
        const tweetId = event.target.getAttribute('data-id');

        const span = document.getElementById('span-' + tweetId);

        const tweetText = prompt("Enter new tweet text", span.innerText);

        const data = {
            tweetId,
            title: tweetText,
            text: "Random value",
            userId: "123"
        }

        const response = await fetch('https://twitter-backend-6yot.onrender.com/tweet/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        const result = await response.json();

        if (result.status !== 200) {
            alert(result.message);
            return;
        }

        alert("Updated Successfully");
        span.innerText = tweetText;
    }


})

window.addEventListener('scroll', () => {
    const {
        scrollTop,
        scrollHeight,
        clientHeight
    } = document.documentElement;

    // console.log(scrollTop, scrollHeight, clientHeight);

    if ((scrollTop + clientHeight) >= (scrollHeight - 20)) {
        getTweetsAndInsertHTML();
    }
})




let postBtn = document.querySelector(".post-btn");
let postReply = document.querySelector(".post-reply");
let postInput = document.querySelector(".post-input");

postInput.addEventListener("click", () => {
    postBtn.style.display = "block";
    postReply.style.display = "block";
});