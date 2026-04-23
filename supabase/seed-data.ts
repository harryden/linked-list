import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
import { eventCodeFromId } from "../src/lib/events";

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seed() {
  console.log("🌱 Starting database seeding...");

  // Deterministic seed for reproducible results
  faker.seed(123);

  // 1. Create Test Organizers
  console.log("👤 Creating organizers...");
  const organizers = [];
  for (let i = 0; i < 5; i++) {
    const id = faker.string.uuid();
    const name = faker.person.fullName();
    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id,
        name,
        avatar_url: faker.image.avatar(),
        headline: `${faker.person.jobTitle()} @ ${faker.company.name()}`,
        linkedin_id: faker.string.alphanumeric(10),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) console.error("Error creating organizer:", error);
    else organizers.push(data);
  }

  // 2. Create Events
  console.log("📅 Creating events...");
  const events = [];
  for (const organizer of organizers) {
    // Each organizer has 2-4 events
    const eventCount = faker.number.int({ min: 2, max: 4 });
    for (let i = 0; i < eventCount; i++) {
      const id = faker.string.uuid();
      const name = `${faker.company.catchPhraseAdjective()} ${faker.commerce.department()} ${faker.helpers.arrayElement(["Meetup", "Workshop", "Dinner", "Mixer"])}`;
      const startsAt = faker.date.between({
        from: faker.date.recent({ days: 30 }),
        to: faker.date.soon({ days: 30 }),
      });
      const endsAt = new Date(startsAt.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

      const { data, error } = await supabase
        .from("events")
        .insert({
          id,
          organizer_id: organizer.id,
          name,
          slug:
            faker.helpers.slugify(name).toLowerCase() +
            "-" +
            faker.string.alphanumeric(6),
          description: faker.lorem.paragraphs(2),
          location: `${faker.location.streetAddress()}, ${faker.location.city()}`,
          starts_at: startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
          short_code: eventCodeFromId(id),
        })
        .select()
        .single();

      if (error) console.error("Error creating event:", error);
      else events.push(data);
    }
  }

  // 3. Create Attendees and Attendances
  console.log("🎟️ Creating attendees and attendances...");
  for (const event of events) {
    // Each event has 5-15 attendees
    const attendeeCount = faker.number.int({ min: 5, max: 15 });
    for (let i = 0; i < attendeeCount; i++) {
      const userId = faker.string.uuid();
      const name = faker.person.fullName();

      // Create profile for attendee
      const { error: pError } = await supabase.from("profiles").upsert({
        id: userId,
        name,
        avatar_url: faker.image.avatar(),
        headline: faker.person.jobTitle(),
        linkedin_id: faker.string.alphanumeric(10),
        updated_at: new Date().toISOString(),
      });

      if (pError) {
        console.error("Error creating attendee profile:", pError);
        continue;
      }

      // Create attendance
      const { error: aError } = await supabase.from("attendances").insert({
        event_id: event.id,
        user_id: userId,
        created_at: faker.date
          .between({ from: event.starts_at, to: event.ends_at })
          .toISOString(),
      });

      if (aError) console.error("Error creating attendance:", aError);
    }
  }

  // 4. Create Feedback
  console.log("💬 Creating feedback...");
  for (let i = 0; i < 20; i++) {
    const { error } = await supabase.from("feedback").insert({
      user_id: faker.helpers.arrayElement(organizers).id,
      type: faker.helpers.arrayElement(["bug", "feature", "other"]),
      message: faker.lorem.sentence(),
      page_path: faker.helpers.arrayElement([
        "/",
        "/dashboard",
        "/create-event",
      ]),
      created_at: faker.date.recent().toISOString(),
    });
    if (error) console.error("Error creating feedback:", error);
  }

  console.log("✅ Seeding complete!");
}

seed().catch(console.error);
