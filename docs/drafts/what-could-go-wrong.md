---
slug: what-could-go-wrong
title: What could go wrong?
date: October 2026
tags: [agents, security, privacy]
excerpt: Setting up Muse meant giving it Full Disk Access and Screen Recording. Then I went back and thought about what I'd agreed to.
---

<!-- [TODO] lines need your real details. Everything else is a draft to push back on. -->

I've been setting up Muse on my personal laptop. I'm not asking much of it. I want it to check
my email and handle scheduling. Partway through setup macOS started asking me to approve
things, and I approved them: Full Disk Access, then Screen Recording. Each one was a single click. Afterward I opened System Settings to look at
what I'd actually agreed to, and it was a lot more than I'd thought about while clicking.

None of that is needed to read email or move a meeting. My calendar app gets by with access to
my calendar.

This isn't really about Muse. Every agent that works on your computer asks for some version of
this. Muse just happens to be where I stopped and thought about it.

At work, this would go through a security review. On my own machine it's me and a dialog box.

## What I handed over

Full Disk Access sounds like it's about writing files, but most of what it adds is reading.
Any program I run can already change most of my home folder. Full Disk Access opens up the
parts macOS normally keeps behind a prompt: Mail, Messages, Safari history, Documents and
Desktop, and my Time Machine backups.

Screen Recording means it sees whatever I see. On a normal day that includes my password
manager, my bank and my DMs.

Together that's read access to nearly everything I do on this computer, plus the ability to
change or delete anything on the disk.

## Could I get locked out?

This was my first worry. If the agent did something I didn't want, could it take the machine
away from me?

Probably not, and the reason is reassuring. The agent runs as my user. It can't change system
files without my admin password, and System Integrity Protection stops even an admin from
touching the OS itself. Changing my login password requires the current one.

So the machine itself is fairly safe. What I'd stand to lose is what's on it and everything
it's logged into.

## The company on the other end

There's a part of this that doesn't need anything to go wrong. The model behind an agent like
this usually runs on someone else's servers, so whatever it looks at to help me gets sent
there. A screenshot of my inbox, a file it opened, the page I had up. That's how the product
works on a good day.

In Muse's case that's Meta, and it's free. Meta makes its money from ads, which run on knowing
who you are and sorting you into groups. [TODO: check Muse's privacy policy. Does it say
anything about ads, training or how long it keeps data? Quote it if so. If you didn't read it
during setup, say that.]

For years tech companies have wanted as much of my data as they could get, and I've gotten
used to handing over pieces of it: my searches, my location, my photos. An agent wants the
whole thing at once, along with how I work and the accounts I'm signed into. And I'm the one
installing it and clicking Allow.

Once it's collected, it's out of my hands. In 2021 the phone numbers and profile details of
over 500 million Facebook users were posted online for free. A company can have good
intentions and still lose the data.

The sorting worries me too. Meta's ad system was found to show housing ads to people
differently by race and sex, and Meta settled with the US Justice Department over it in 2022.
Nobody had to design that on purpose. The system learned it from the data. If an assistant
reading my inbox and calendar feeds into a system like that, it's drawing conclusions about me
from far more than my likes, and I'd never see what they were.

## What going wrong would look like

I don't expect an agent to turn on me. The likelier failure is it doing what it thinks I asked.
"Clean up my downloads" with a slightly wrong idea of which folder. A script with a bad path.
I've watched coding agents do confidently wrong things in a repo, where git makes it easy to
undo. My home folder has no git.

Then there's text I didn't write. An agent reading my screen and my files is reading other
people's words: emails, web pages, PDFs. If one of those contains instructions aimed at the
agent, it might follow them. That's prompt injection, and nobody has a fix that works every
time. The labs train against it and run filters, which lowers the odds. An attacker only needs
one email to get through.

Simon Willison calls the risky setup the "lethal trifecta": an agent with access to private
data, exposure to content someone else wrote, and a way to send things out. Any two of those
are manageable. With Full Disk Access, Screen Recording and an internet connection, I'd given
it all three.

Email makes this worse. Reading messages from strangers is the whole job, so the untrusted
content is most of what it reads. And my inbox is where every
password reset goes. Anything that can read my email and act on it can get into most of my
other accounts.

The quiet version is the one that bothers me most. While doing something legitimate it reads
`~/.ssh`, `~/.aws` or a `.env` file, and the contents end up somewhere they shouldn't. Nothing
would break, so I probably wouldn't notice.

## Why I clicked yes

I knew most of this before I clicked. I clicked anyway, because the prompts showed up at the
exact moment I wanted the thing to work. Every permission was a roadblock between me and
trying it, and saying no just meant a broken setup.

That's the problem with asking once, up front. All the friction comes before I've seen the
tool do anything, and all the risk comes later, spread across months of use. Windows Vista
tried warning people more often with UAC, and everyone learned to click through it without
reading.

Phones went through this already. Android used to show every permission at install time, and
in 2015 it switched to asking when an app actually needed something. iOS added "Allow once."
Agents are still at the install-time stage. Muse needs to see my screen to help with what's on
it, but that doesn't mean it should see my screen all the time. Reading a file is easy to live
with. Deleting one or sending an email can't be taken back, and those are where I'd want it to
stop and ask.

[TODO: does Muse ask before risky actions, or is it all-or-nothing? A sentence on that fits
here.]

## Where's the off switch?

I tried to work out what I'd actually do if it went sideways in the middle of a task.

Force Quit would work, as long as I noticed in time. Turning off Wi-Fi would stop anything from leaving the machine. Holding the power button would
stop everything, and it's the one control no software can get in the way of. The model runs in
the cloud, so signing out of the account from my phone would cut it off as well. After that
I'd be changing passwords from my phone and assuming anything it could read had been read.

I had to put that list together myself. The setup walked me through granting each permission
and said nothing about how to stop it. [TODO: verify. Does Muse have a stop button or hotkey?
If so, mention that it lives inside the software you'd be trying to stop.] Some laptops have a
physical switch for the camera. Nothing like that exists for an agent yet.

[TODO: short personal ending. Where you've landed: still using it, using it with changes, or
still deciding. An open question of your own is fine; advice to the reader isn't.]
